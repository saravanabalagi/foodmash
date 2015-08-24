class CartDeliveryAddress < ActiveRecord::Base
	belongs_to :cart
	belongs_to :delivery_address
	validates :cart_id, presence: true, uniqueness: true
	validates :delivery_address_id, presence: true
end
