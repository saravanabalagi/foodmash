class Cuisine < ActiveRecord::Base
	resourcify
	before_save {|cuisine| write_attribute(:name, cuisine.name.downcase)}
	has_many :dishes
	validates_presence_of :name
	validates_uniqueness_of :name
end
