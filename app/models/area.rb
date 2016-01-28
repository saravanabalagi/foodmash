class Area < ActiveRecord::Base
	before_save {|area| write_attribute(:name, area.name.downcase)}
	validates :name, presence: true, length: {minimum: 2}
	validates :city_id, presence: true
	belongs_to :city 
	belongs_to :packaging_centre
	has_many :restaurants
end
