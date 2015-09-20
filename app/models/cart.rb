class Cart < ActiveRecord::Base
	resourcify
	belongs_to :user
	has_one :delivery_address
	has_many :order_items, through: :orders
	has_many :orders, dependent: :destroy
	before_save :update_total
	after_save :update_orders
	include AASM

	aasm do
	  state :not_started, :initial => true
	  state :purchased
	  state :ordered
	  state :dispatched
	  state :delivered

	  event :cancel do
	    transitions :from => :purchased, :to => :not_started
	  end

	  event :purchase do
	    transitions :from => :not_started, :to => :purchased
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

	

	def update_total
		self.total = self.total_price
		return true
	end
	
	def total_price
		self.orders.to_a.sum {|order| order.total}
	end

	def update_orders
		if self.purchased?	
			self.orders.each {|order| order.product.update_attributes! no_of_purchases: order.quantity; order.order_items.each{|order_item| order_item.item.update_attributes! no_of_purchases: order_item.quantity} }
		end
		return true
	end

	def generate_order_id
		self.order_id = "OD" + Digest::SHA1.hexdigest(Time.now.to_s)[0..9]
		self.save!
	end
end
