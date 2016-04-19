class DishType < ActiveRecord::Base
	before_save {|dish_type| write_attribute(:name, dish_type.name.split.each{|s| s[0] = s[0].upcase}.join(' '))}
	has_many :dishes
	has_many :combo_dishes
	validates_presence_of :name
	validates_uniqueness_of :name
end
