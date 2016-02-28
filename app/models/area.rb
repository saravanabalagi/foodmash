class Area < ActiveRecord::Base
	before_save {|area| write_attribute(:name, area.name.split.each{|s| s[0] = s[0].upcase}.join(' '))}
	validates :name, presence: true, length: {minimum: 2}
	validates :city_id, presence: true
	validates :pincode, presence: true
	belongs_to :city 
	belongs_to :packaging_centre
	has_many :restaurants
	has_many :delivery_addresses
end
