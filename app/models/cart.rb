class Cart < ActiveRecord::Base
	resourcify
	belongs_to :user
	has_one :delivery_address
	has_many :order_items, through: :orders
	has_many :orders, dependent: :destroy
	before_save :calculate_total
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

	def change_status(status)
		case status
			when 'purchase' 
				purchase!
			when 'cancel' 
				cancel!
			when 'order' 
				order!
			when 'dispatched' 
				dispatch!
			when 'delivered' 
				deliver!
		end
	end

	def add_items_to_cart(cart)
		if self.orders.present?
			self.orders.each do |order|
				unless cart[:orders].collect{|o| o[:id]}.compact.include? order.id
					order.destroy!
				end
			end
		end
		self.reload
		if cart[:orders].present?
			cart[:orders].each do |cart_order|
				if cart_order[:id].present?
					current_order = self.orders.find(cart_order[:id]) if cart_order[:id]
					if current_order
						current_order.update_attributes!(quantity: cart_order[:quantity]) unless cart_order[:quantity] == current_order[:quantity]
						if cart_order[:order_items].present?
							current_order.order_items.each do |order_item|
								cart_order[:order_items].each do |cart_order_item|
									if cart_order_item[:id] and order_item.id == cart_order_item[:id]
										order_item.update_attributes!(quantity: cart_order_item[:quantity]) unless order_item.quantity == cart_order_item[:quantity]
									end
								end
							end
						end
					end
				else
					future_order = self.orders.build(product_id: cart_order[:product][:id], product_type: "Combo", quantity: cart_order[:quantity])
					if cart_order[:order_items].present?
						cart_order[:order_items].each do |cart_order_item|
							if cart_order_item[:category_type].present? and cart_order_item[:category_type] == 'ComboOption'
								future_order.order_items.build(category_id: cart_order_item[:category_id], category_type: cart_order_item[:category_type], item_id: cart_order_item[:item][:id], item_type: "Dish", quantity: cart_order_item[:quantity])
							elsif cart_order_item[:category_type].present? and cart_order_item[:category_type] == 'ComboDish'
								future_order.order_items.build(category_id: cart_order_item[:category_id], category_type: cart_order_item[:category_type], item_id: cart_order_item[:item][:id], item_type: "Dish", quantity: cart_order_item[:quantity])
							end
						end
					end
				end
			end
		end
			self.delivery_address_id = cart[:delivery_address_id] if cart[:delivery_address_id]
			self.save!
	end

	def generate_order_id
		self.order_id = "OD" + Digest::SHA1.hexdigest(Time.now.to_s)[0..9]
		self.save!
	end

	private
	def calculate_total
		self.total = orders.to_a.sum{|o| (o.order_items.to_a.sum{|oi| (oi.item.price * oi.quantity) || 0} * o.quantity) || 0}
	end

	def update_orders
		if self.purchased?	
			orders.each {|order| order.product.update_attributes! no_of_purchases: order.quantity; order.order_items.each{|order_item| order_item.item.update_attributes! no_of_purchases: (order_item.quantity*order_item.order.quantity)} }
		end
		return true
	end
end
