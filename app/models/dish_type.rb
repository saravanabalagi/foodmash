class DishType < ActiveRecord::Base
	before_save {|dish_type| write_attribute(:name, dish_type.name.downcase)}
	has_many :combo_options
	has_many :dishes
	has_many :combo_dishes
	validates_uniqueness_of :name
end
