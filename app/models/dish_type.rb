class DishType < ActiveRecord::Base
	belongs_to :combo_option
	belongs_to :dish
end
