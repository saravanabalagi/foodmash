class PackagingCentre < ActiveRecord::Base
	before_save {|centre| write_attribute(:name, centre.name.downcase)}
	has_many :combos
	has_many :areas
end
