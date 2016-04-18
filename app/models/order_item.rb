class OrderItem < ActiveRecord::Base
	resourcify
	belongs_to :order
	delegate :restaurant, to: :item
	belongs_to :item, polymorphic: true
	validates :quantity, numericality: {greater_than: 0, lesser_than: 500}
	validates :item, presence: true
	validates :order, presence: true
	after_save :update_order
	after_destroy :update_order

	include AASM

	aasm do
	  state :not_started, :initial => true
	  state :ordered
	  state :cooked
	  state :collected

	  event :acknowledge do
	    transitions :from => :not_started, :to => :ordered
	  end

	  event :cook do
	    transitions :from => :ordered, :to => :cooked
	  end

	  event :collect do
	    transitions :from => :cooked, :to => :collected
	  end
	end

	private
	def update_order
		order.save!
	end
end
