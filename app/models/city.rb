class City < ActiveRecord::Base
	before_save {|city| write_attribute(:name, city.name.titleize)}
	has_many :areas
	has_many :packaging_centres, through: :areas
	validates_presence_of :name
	validates_uniqueness_of :name
end
