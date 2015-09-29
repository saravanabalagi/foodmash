class Order < ActiveRecord::Base
	resourcify
	has_many :order_items, dependent: :destroy
	belongs_to :cart
	belongs_to :product, polymorphic: true
	validates :quantity, numericality: {greater_than: 0, lesser_than: 500}
	validates_presence_of :cart_id, :quantity
	validates :product, presence: true
	after_save :update_cart
	after_destroy :update_cart
	before_save :total_price
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

	private

	def update_cart
		self.cart.save!
	end

	def total_price
		total = 0
		self.order_items.each do |order_item|
			total += self.quantity * order_item.quantity * order_item.item.price
		end
		self.total = total
		return true
	end
end
