class Order < ActiveRecord::Base
	belongs_to :product, polymorphic: true
	belongs_to :cart

	def total_price
		product.price * quantity
	end
end
