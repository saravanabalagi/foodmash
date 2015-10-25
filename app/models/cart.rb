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
				order.destroy! unless cart[:orders].collect{|o| o[:id]}.compact.include? order.id
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

	def add_cart(cart_items, delivery_address_id)
		byebug
		if self.orders.present?
			self.orders.each do |order|
				if cart_items.present?
					order.destroy! unless cart_items.collect{|i| i["id"]}.include? order.product.id
				end 
			end
		end
		self.reload

		if cart_items.present?
			cart_items.each do |cart_item|
				sim = false
				self.orders.each do |order|
					if check_for_similarity(order, cart_item)
						order.update_attributes!(quantity: cart_item["quantity"]) unless cart_item["quantity"] == order.quantity
						if self.order.order_items.present?
							self.order.order_items.each do |order_item|
								if cart_item["comboDishes"].present?
									cart_item["comboDishes"].each do |combo_dish| 
										if combo_dish["dish"]["id"] == order_item.item.id and (combo_dish["id"] == order_item.category_id and order_item.category_type == 'ComboDish')
											order_item.update_attributes!(quantity: combo_dish["quantity"]) unless combo_dish["quantity"] == order_item.quantity
										end
									end							
								end
								if cart_item["comboOptions"].present?
									cart_item["comboOptions"].each do |combo_option|
										if (combo_option["id"] == order_item.category_id and order_item.category_type == 'ComboOption')
											if combo_option["comboOptionDishes"].present?
												combo_option["comboOptionDishes"].each do |combo_option_dish|
													if combo_option_dish["dish"]["id"] == order_item.item.id
														order_item.update_attributes!(quantity: combo_option_dish["quantity"]) unless combo_option_dish["quantity"] == order_item.quantity
													end
												end
											end
										end
									end
								end
							end
						end
						sim = true
						break
					end
				end
				unless sim
					future_order = self.orders.build(product_id: cart_item["id"], product_type: 'Combo', quantity: cart_item["quantity"])
					if cart_item["comboDishes"].present?
						cart_item["comboDishes"].each do |combo_dish| 
							future_order.order_items.build(category_id: combo_dish["id"], category_type: 'ComboDish', item_id: combo_dish["dish"]["id"], item_type: "Dish", quantity: combo_dish["quantity"])
						end							
					end
					if cart_item["comboOptions"].present?
						cart_item["comboOptions"].each do |combo_option|
							if combo_option["comboOptionDishes"].present?
								combo_option["comboOptionDishes"].each do |combo_option_dish|
									future_order.order_items.build(category_id: combo_option["id"], category_type: 'ComboOption', item_id: combo_option_dish["dish"]["id"], item_type: "Dish", quantity: combo_option_dish["quantity"])
								end
							end
						end
					end	
				end
			end
		end
		self.delivery_address_id = delivery_address_id
		self.save!
	end

	def check_for_similarity(order, cart_item)
		order_item_count = order.order_items.count
		cart_order_item_count = 0
		if order.product.id == cart_item["id"]
			order.order_items.each do |order_item|
				if order_item.category.type == "ComboDish"
					cart_item["comboDishes"].each do |combo_dish|
						if order_item.category_id == combo_dish["id"] and order_item.item.id == combo_dish["dish"]["id"]
							cart_order_item_count += 1
						end
					end 
				end
				if order_item.category_type == "ComboOption"
					cart_item["comboOptions"].each do |combo_option|
						if order_item.category_id == combo_option["id"] and order_item.item.id == combo_option["dish"]["id"]
							cart_order_item_count += 1
						end
					end
				end
			end
		end

		if order_item_count == cart_order_item_count
			return true
		else
			return false
		end
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