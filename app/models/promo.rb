class Promo < ActiveRecord::Base
	before_save {|promo| write_attribute(:code, promo.code.downcase)}
	has_and_belongs_to_many :users, :join_table => "promos_users"
	has_many :carts
end
