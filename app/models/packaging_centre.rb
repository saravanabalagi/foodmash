class PackagingCentre < ActiveRecord::Base
	has_many :combos
	has_many :areas
end
