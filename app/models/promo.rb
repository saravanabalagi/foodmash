class Promo < ActiveRecord::Base
	before_save {|promo| write_attribute(:code, promo.code.downcase)}
	has_and_belongs_to_many :users, :join_table => "promos_users"
	has_many :carts
	validates :discount_percentage, numericality: {greater_than_or_equal_to: 0.0, less_than_or_equal_to: 1.0}
end
