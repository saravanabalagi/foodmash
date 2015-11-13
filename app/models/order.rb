class Order < ActiveRecord::Base
	resourcify
	has_many :order_items, dependent: :destroy
	belongs_to :cart
	belongs_to :product, polymorphic: true
	validates :quantity, numericality: {greater_than: 0, lesser_than: 500}
	validates_presence_of :cart_id, :quantity
	validates :product, presence: true
	before_save :calculate_total
	after_save :update_cart
	after_destroy :update_cart
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
	def calculate_total
		self.total = order_items.to_a.sum{|o| (o.item.price * o.quantity) || 0}
	end

	def update_cart
		cart.save!
	end
end
