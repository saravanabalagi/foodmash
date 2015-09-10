class OrderItem < ActiveRecord::Base
	resourcify
	belongs_to :order
	delegate :restaurant, to: :item
	belongs_to :item, polymorphic: true
	validates :quantity, numericality: {greater_than: 0, lesser_than: 500}
	belongs_to :category, polymorphic: true
	validates :item, presence: true
	validates :category, presence: true
	validates :order, presence: true
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
end
