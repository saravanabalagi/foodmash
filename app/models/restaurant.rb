class Restaurant < ActiveRecord::Base
	resourcify
	has_many :order_items, through: :dishes
	has_many :dishes, dependent: :destroy
	has_many :dish_types, through: :dishes

	def has_combos
	   combos_from_cos = Combo.find_by_sql("select * from Combos where Combos.id in
	  	(select Combo_Options.combo_id from Combo_Options where Combo_Options.id in 
	  	(select Combo_Option_Dishes.combo_option_id from Combo_Option_Dishes where Combo_Option_Dishes.dish_id in
	  	(select Dishes.id from Dishes inner join Restaurants where 
	  	#{self.id} = Dishes.restaurant_id)))")

	   combos = combos_from_cos

	   combos_from_cds = self.dishes.each {|d| combos << d.combos}

	   return combos.uniq
  end
end