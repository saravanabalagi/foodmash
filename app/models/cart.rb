class Cart < ActiveRecord::Base
	belongs_to :user
	has_many :orders, dependent: :destroy
	include AASM

	aasm do
	  state :not_started, :initial => true
	  state :submitted
	  state :purchased
	  state :ordered
	  state :dispatched
	  state :delivered

	  event :submit do
	    transitions :from => :not_started, :to => :submitted
	  end

	  event :cancel do
	    transitions :from => :submitted, :to => :not_started
	  end

	  event :purchase do
	    transitions :from => :submitted, :to => :purchased
	  end

	  event :order do 
			transitions :from => :purchased, :to => :ordered
	  end

	  event :dispatch do 
	  	transitions :from => :ordered, :to => :dispatched
	  end

	  event :deliver do 
	  	transitions :from => :dispatched, :to => :delivered
	  end
	end

	def add_product(product)
		current_item = orders.find_by(product: product)
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
