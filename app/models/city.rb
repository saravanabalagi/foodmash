class City < ActiveRecord::Base
	before_save {|city| write_attribute(:name, city.name.titleize)}
	validates :name, presence: true, length: {minimum: 2}
	has_many :areas
	has_many :packaging_centres, through: :areas
end
