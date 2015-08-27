class Order < ActiveRecord::Base
	has_many :order_items, dependent: :destroy
	belongs_to :cart
	belongs_to :product, polymorphic: true
	validates_presence_of :cart_id, :quantity
	validates :product, presence: true
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
		self.product.price * quantity
	end
end
