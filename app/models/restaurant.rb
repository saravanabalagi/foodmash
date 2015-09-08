class Restaurant < ActiveRecord::Base
	resourcify
	has_many :order_items, through: :dishes
	has_many :dishes, dependent: :destroy
	has_many :dish_types, through: :dishes

	def has_combos
		combos = []

	  self.dishes.each {|dish| dish.combo_options.each {|combo_option| combos << combo_option.combo} }

	  self.dishes.each {|dish| combos << dish.combos}

	  return combos.uniq
  end
end