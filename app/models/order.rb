class Order < ActiveRecord::Base
	has_many :order_items, dependent: :destroy
	belongs_to :cart
	belongs_to :product, polymorphic: true
	validates :quantity, numericality: {greater_than: 0}
	validates_presence_of :cart_id, :quantity
	validates :product, presence: true
	after_save :update_order_items
	after_save :update_cart
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

	def update_cart
		self.cart.save!
		return true
	end

	def update_order_items
		self.order_items.update_all(quantity: self.quantity) if self.order_items.present?
	end

	def total_price
		self.total = self.product.price * quantity
		true
	end
end
