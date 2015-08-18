class DishType < ActiveRecord::Base
	has_many :combo_options
	has_many :dishes
	validates_uniqueness_of :name
end
