class Dish < ActiveRecord::Base
  belongs_to :restaurant
  has_one :dish_type
  has_many :order_items, as: :item
  validates :restaurant_id, presence: true
  validates :dish_type_id, presence: true

  def belongs_to_combos
	  Combo.find_by_sql("select * from Combos where Combos.id in 
	  	(select Combo_Options.combo_id from Combo_Options where Combo_Options.id in  
	  	(select Combo_Option_Dishes.combo_option_id from Dishes inner join Combo_Option_Dishes where 
	  	#{self.id} = Combo_Option_Dishes.dish_id))")
  end
end
