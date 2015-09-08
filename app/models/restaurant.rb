class Restaurant < ActiveRecord::Base
	resourcify
	has_many :order_items, through: :dishes
	has_many :dishes, dependent: :destroy
	has_many :dish_types, through: :dishes

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

	  return combos.uniq
  end
end