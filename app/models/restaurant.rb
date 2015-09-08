class Restaurant < ActiveRecord::Base
	resourcify
	has_many :order_items, through: :dishes
	has_many :dishes, dependent: :destroy
	has_many :dish_types, through: :dishes

	def has_combos
		combos = []

	  self.dishes.each {|dish| dish.combo_options.each {|combo_option| combos << combo_option.combo if combo_option.combo.present?} if dish.combo_options.present? } if self.dishes.present?

	  self.dishes.each {|dish| combos << dish.combos if dish.combos.present? } if self.dishes.present?

	  return combos.uniq
  end
end