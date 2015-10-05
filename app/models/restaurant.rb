class Restaurant < ActiveRecord::Base
	resourcify
	has_many :dishes, dependent: :destroy
	has_many :dish_types, through: :dishes


	def get_carts_for_restaurant
		carts_list = []
		if dishes.present?
			dishes.each do |dish|
				if dish.order_items.present?
					dish.order_items.each do |order_item|
						carts_list << order_item.order.cart
					end
				end
			end
		end
		return carts_list.flatten.select{|c| c.aasm_state == 'purchased'}
	end

	def has_combos
		combos = []
		if self.dishes.present?
	  	self.dishes.each {|dish|
	  	if dish.combo_options.present?
	  		 dish.combo_options.each {|combo_option|
	  		 	if combo_option.combo.present?
	  		 		combos << combo_option.combo 
	  		 	end
	  		 }
	  	end
	  	} 
	  end
	  
	  if self.dishes.present?
	  	self.dishes.each {|dish|
	  	if dish.combos.present?  
	  		combos << dish.combos
	  	end
	  	} 
	  end

	  return combos.flatten.uniq
  end
end