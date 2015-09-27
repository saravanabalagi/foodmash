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

	  event :purchase do
	    transitions :from => :not_started, :to => :purchased
	  end

	  event :cancel do
	    transitions :from => :purchased, :to => :not_started
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
			if order[:id].present?
				current_order = self.orders.find(order[:id]) if order[:id]
				if current_order
					current_order.update_attributes!(quantity: order[:quantity])
					if cart[:order_items].present? 
						current_order[:order_items].each do |order_item|
							order[:order_items].each do |cart_order_item|
								if order_item[:id] == cart_order_item[:id]
									order_item.update_attributes!(quantity: cart_order_item[:quantity]) unless order_item[:quantity] == cart_order_item[:quantity]
								end
							end
						end
					end
				end
			else
				future_order = self.orders.build(product_id: order[:product][:id], product_type: "Combo", quantity: order[:quantity])
				if order[:order_items].present?
					order[:order_items].each do |order_item|
						if order_item[:category_type].present? and order_item[:category_type] == 'ComboOption'
							future_order.order_items.build(category_id: order_item[:category_id], category_type: order_item[:category_type], item_id: order_item[:item][:id], item_type: "Dish", quantity: order_item[:quantity])
						elsif order_item[:category_type].present? and order_item[:category_type] == 'ComboDish'
							future_order.order_items.build(category_id: order_item[:category_id], category_type: order_item[:category_type], item_id: order_item[:item][:id], item_type: "Dish", quantity: order_item[:quantity])
						end
					end
				end
			end
		end
		self.delivery_address_id = cart[:delivery_address_id] if cart[:delivery_address_id]
		return self if self.save!
	end

	def total_price
		self.orders.to_a.sum {|order| order.total}
	end

	def generate_order_id
		self.order_id = "OD" + Digest::SHA1.hexdigest(Time.now.to_s)[0..9]
		self.save!
	end

	private

	def update_orders
		if self.purchased?	
			self.orders.each {|order| order.product.update_attributes! no_of_purchases: order.quantity; order.order_items.each{|order_item| order_item.item.update_attributes! no_of_purchases: order_item.quantity} }
		end
		return true
	end

	def update_total
		self.total = self.total_price
		return true
	end
end
