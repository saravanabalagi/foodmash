class Cart < ActiveRecord::Base
	belongs_to :user
	has_many :orders, dependent: :destroy

	def add_product(product_id)
		current_item = orders.find_by(product_id: product_id)
		if current_item
			current_item.quantity += 1
		else
			current_item = orders.build(product_id: product_id)
		end
		current_item
	end

	def total_price
		orders.to_a.sum {|order| order.total_price}
	end
end
