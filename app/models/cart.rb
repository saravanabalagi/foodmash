class Cart < ActiveRecord::Base
	resourcify
	belongs_to :user
	has_one :delivery_address
	has_many :order_items, through: :orders
	has_many :orders, dependent: :destroy
	before_save :update_total
	after_save :update_orders
	include AASM

	aasm do
	  state :not_started, :initial => true
	  state :purchased
	  state :ordered
	  state :dispatched
	  state :delivered

	  event :cancel do
	    transitions :from => :purchased, :to => :not_started
	  end

	  event :purchase do
	    transitions :from => :not_started, :to => :purchased
	  end

	  event :order do 
			transitions :from => :purchased, :to => :ordered
	  end

	  event :dispatch do 
	  	transitions :from => :ordered, :to => :dispatched
	  end

	  event :deliver do 
	  	transitions :from => :dispatched, :to => :delivered
	  end
	end

	def add_items_to_cart(cart)
		cart[:orders].each do |order|
			future_order = self.orders.build(product_id: order[:combo_id], product_type: "Combo", quantity: order[:quantity])
			order[:order_items].each do |order_item|
				if order_item[:combo_option_id].present?
					future_order.order_items.build(category_id: order_item[:combo_option_id], category_type: "ComboOption", item_id: order_item[:dish_id], item_type: "Dish", quantity: order_item[:quantity])
				elsif order_item[:combo_dish_id].present?
					future_order.order_items.build(category_id: order_item[:combo_dish_id], category_type: "ComboDish", item_id: order_item[:dish_id], item_type: "Dish", quantity: order_item[:quantity])
				end
			end
		end
		return self if self.save!
	end

	def update_total
		self.total = self.total_price
		return true
	end
	
	def total_price
		self.orders.to_a.sum {|order| order.total}
	end

	def update_orders
		if self.purchased?	
			self.orders.each {|order| order.product.update_attributes! no_of_purchases: order.quantity; order.order_items.each{|order_item| order_item.item.update_attributes! no_of_purchases: order_item.quantity} }
		end
		return true
	end

	def generate_order_id
		self.order_id = "OD" + Digest::SHA1.hexdigest(Time.now.to_s)[0..9]
		self.save!
	end
end
