class PackagingCentre < ActiveRecord::Base
	resourcify
	before_save {|centre| write_attribute(:name, centre.name.titleize)}
	has_many :combos
	has_many :areas
	validates_presence_of :name
	validates_uniqueness_of :name
end
