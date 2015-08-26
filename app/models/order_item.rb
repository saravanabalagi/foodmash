class OrderItem < ActiveRecord::Base
	validates_presence_of :order_id, :item_id, :item_type
	belongs_to :order
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
