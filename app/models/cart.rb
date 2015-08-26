class Cart < ActiveRecord::Base
	belongs_to :user
	has_one :delivery_address, through: :cart_delivery_address
	has_one :cart_delivery_address
	has_many :order_items, through: :orders, dependent: :destroy
	has_many :orders, dependent: :destroy
	include AASM

	aasm do
	  state :not_started, :initial => true
	  state :submitted
	  state :purchased
	  state :ordered
	  state :dispatched
	  state :delivered

	  event :submit do
	    transitions :from => :not_started, :to => :submitted
	  end

	  event :cancel do
	    transitions :from => :submitted, :to => :not_started
	  end

	  event :purchase do
	    transitions :from => :submitted, :to => :purchased
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

	def add_combo(combo_id, selected_dishes)
		combo = Combo.find combo_id
		current_order = self.orders.find_by(product_id: combo_id)
		current_order_items = current_order.order_items if current_order

		if current_order and check_with_incoming_order(current_order, selected_dishes, combo_id)
			current_order.quantity += 1
			return current_order
		else
			future_order = self.orders.build(product_id: combo_id, product_type: "Combo", total: combo.price)
			selected_dishes.each do |s_dish|
				if(s_dish.combo_id == combo_id)
					future_order_items = future_order.order_items.build(item_id: s_dish.dish_id, item_type: "Dish", category_id: s_dish.combo_option_id, category_type: "ComboOption")
				end
			end
			return future_order
		end
	end

	def check_with_incoming_order(current_order, selected_dishes, combo_id)
		current_order_items_length = current_order.order_items.length
		counting_length = 0
		selected_dishes.each do |s_dish|
			if current_order.order_items.item_id == s_dish.dish_id and current_order.order_items.category_id == s_dish.combo_option_id and combo_id == s_dish.combo_id
				counting_length += 1
			end
		end
		if counting_length == current_order_items
			return true
		else
			return false
		end
	end
	
	def total_price
		self.orders.to_a.sum {|order| order.total_price}
	end
end
