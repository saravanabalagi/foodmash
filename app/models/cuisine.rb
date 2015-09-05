class Cuisine < ActiveRecord::Base
	has_many :dishes
	validates_presence_of :name
	validates_uniqueness_of :name
end
