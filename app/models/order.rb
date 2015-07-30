class Order < ActiveRecord::Base
	has_one :product, polymorphic: true
	has_many :order_items
	belongs_to :cart
	include AASM

	aasm do
	  state :not_started, :initial => true
	  state :ordered
	  state :collected
	  state :dispatched

	  event :ordered_all do
	    transitions :from => :not_started, :to => :ordered
	  end

	  event :collected_all do 
	  	transitions :from => :ordered, :to => :collected
	  end

	  event :dispatch do 
	  	transitions :from => :collected, :to => :dispatched
	  end
	end

	def total_price
		product.price * quantity
	end
end
