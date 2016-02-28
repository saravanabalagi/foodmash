class City < ActiveRecord::Base
	before_save {|city| write_attribute(:name, city.name.split.each{|s| s[0] = s[0].upcase}.join(' '))}
	has_many :areas
	has_many :packaging_centres, through: :areas
	validates_presence_of :name
	validates_uniqueness_of :name
end
