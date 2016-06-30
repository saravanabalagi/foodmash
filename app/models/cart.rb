class Cart < ActiveRecord::Base
	resourcify
	belongs_to :user
	belongs_to :delivery_address
	has_many :order_items, through: :orders
	has_many :orders, dependent: :destroy
	after_save :update_orders_for_save
	belongs_to :promo
	include AASM

	aasm do
	  state :not_started, :initial => true
	  state :purchased
	  state :ordered
	  state :dispatched
	  state :delivered

	  event :purchase do
	    transitions :from => :not_started, :to => :purchased
	  end

	  event :cancel do
	    transitions :from => [:purchased, :ordered, :dispatched, :delivered], :to => :not_started
	  end

	  event :order_cart do 
		transitions :from => :purchased, :to => :ordered
	  end

	  event :dispatch do 
	  	transitions :from => :ordered, :to => :dispatched
	  end

	  event :deliver do 
	  	transitions :from => :dispatched, :to => :delivered
	  end
	end

	def add_fields_from_payu(params)
		self.mihpayid = params["mihpayid"]
		self.payment_method = params["mode"]
		self.payment_status = params["status"]
		self.payment_unmappedstatus = params["unmappedstatus"]
		self.payment_card_category = params["cardCategory"]
		self.payment_source = params["payment_source"]
		self.pg_type = params["PG_TYPE"]
		self.bank_ref_num = params["bank_ref_num"]
		self.bankcode = params["bankcode"]
		self.payment_error = params["error"]
		self.payment_error_message = params["error_Message"]
		self.payment_name_on_card = params["name_on_card"]
		self.payment_card_no = params["cardnum"]
		self.issuing_bank = params["issuing_bank"]
		self.payment_card_type = params["card_type"]
		self.purchased_at = Time.now
		self.save!
	end

	def remove_fields_from_payu
		self.mihpayid = nil
		self.payment_method = nil
		self.payment_status = nil
		self.payment_unmappedstatus = nil
		self.payment_card_category = nil
		self.payment_source = nil
		self.pg_type = nil
		self.bank_ref_num = nil
		self.bankcode = nil
		self.payment_error = nil
		self.payment_error_message = nil
		self.payment_name_on_card = nil
		self.payment_card_no = nil
		self.issuing_bank = nil
		self.payment_card_type = nil
		self.purchased_at = nil
	end

	def change_status(status)
		case status
			when 'purchase' 
				purchase!
			when 'cancel' 
				if cancel!
					self.orders.destroy_all
					self.delivery_charge = self.vat = self.total = self.grand_total = 0
					current_user = User.find(self.user_id)
					current_user.award_mash_cash(-self.awarded_mash_cash, self)
					self.promo_discount = self.promo_id = nil
					current_user.award_mash_cash(self.mash_cash)
					self.mash_cash = nil
					self.remove_fields_from_payu
				end
			when 'ordered' 
				if order_cart!
					self.ordered_at = Time.now
				end
			when 'dispatched' 
				if dispatch!
					self.dispatched_at = Time.now
				end
			when 'delivered' 
				if deliver!
					self.delivered_at = Time.now
					# current_user = User.find(self.user_id)
					# if self.delivered_at - self.purchased_at > 1.hour
					# 	amount = 0.15 * self.grand_total 
					# 	current_user.award_mash_cash(amount, self)
					# end
				end
		end
		self.save!
	end

	def add_items_to_cart(cart)
		if self.user.verified
			if self.orders.present?
				self.orders.each do |order|
					order.destroy! unless cart[:orders].collect{|o| o[:id]}.compact.include? order.id
				end
			end
			self.reload
			if cart[:orders].present?
				cart[:orders].each do |cart_order|
					if cart_order[:id].present?
						current_order = self.orders.find(cart_order[:id]) if cart_order[:id]
						if current_order
							current_order.update_attributes!(quantity: cart_order[:quantity]) unless cart_order[:quantity] == current_order[:quantity]
							if cart_order[:order_items].present?
								current_order.order_items.each do |order_item|
									cart_order[:order_items].each do |cart_order_item|
										if cart_order_item[:id] and order_item.id == cart_order_item[:id]
											order_item.update_attributes!(quantity: cart_order_item[:quantity]) unless order_item.quantity == cart_order_item[:quantity]
										end
									end
								end
							end
						end
					else
						future_order = self.orders.build(product_id: cart_order[:product][:id], product_type: cart_order[:product][:type], quantity: cart_order[:quantity], note: cart_order[:note])
						if cart_order[:order_items].present?
							cart_order[:order_items].each do |cart_order_item|
								future_order.order_items.build(item_id: cart_order_item[:item][:id], item_type: "Dish", quantity: cart_order_item[:quantity])
							end
						end
					end
				end
			end
			self.delivery_address_id = cart[:delivery_address_id]
			self.calculate_total
			if cart[:promo_id].present? and cart[:promo_discount].present?
				promo = Promo.find(cart[:promo_id])
				promo.users << self.user
				self.promo_id = promo.id
				self.promo_discount = self.total * promo.discount_percentage
				self.grand_total -= self.promo_discount
			end
			if cart[:mash_cash].present?
				user = self.user
				self.mash_cash = cart[:mash_cash].to_f if user.use_mash_cash(cart[:mash_cash].to_f)
				self.grand_total -= self.mash_cash
			end
			DeliveryAddress.make_primary(cart[:delivery_address_id])
			self.save!
		end
	end

	def add_cart(cart_items, delivery_address_id)
		if self.user.verified
			if self.orders.present?
				self.orders.each do |order|
					if cart_items.present?
						order.destroy! unless cart_items.collect{|i| i["id"]}.include? order.product.id
					end 
				end
			end
			self.reload

			if cart_items.present?
				cart_items.each do |cart_item|
					sim = false
					self.orders.each do |order|
						if check_for_similarity(order, cart_item)
							order.update_attributes!(quantity: cart_item["quantity"]) unless cart_item["quantity"] == order.quantity
							if order.order_items.present?
								order.order_items.each do |order_item|
									if cart_item["combo_options"].present?
										cart_item["combo_options"].each do |combo_option|
											if combo_option["combo_option_dishes"].present?
												combo_option["combo_option_dishes"].each do |combo_option_dish|
													if combo_option_dish["dish"]["id"] == order_item.item.id
														order_item.update_attributes!(quantity: combo_option_dish["quantity"]) unless combo_option_dish["quantity"] == order_item.quantity
													end
												end
											end
										end
									end
								end
							end
							sim = true
							break
						end
					end
					unless sim
						future_order = self.orders.build(product_id: cart_item["id"], product_type: "Combo", quantity: cart_item["quantity"], note: cart_item["note"])
						if cart_item["combo_options"].present?
							cart_item["combo_options"].each do |combo_option|
								if combo_option["combo_option_dishes"].present?
									combo_option["combo_option_dishes"].each do |combo_option_dish|
										future_order.order_items.build(item_id: combo_option_dish["dish"]["id"], item_type: "Dish", quantity: combo_option_dish["quantity"])
									end
								end
							end
						end	
					end
				end
			end
			self.delivery_address_id = delivery_address_id
			self.calculate_total
			DeliveryAddress.make_primary(delivery_address_id)
			self.save!
		end
	end

	def check_for_similarity(order, cart_item)
		order_item_count = order.order_items.count
		cart_order_item_count = 0
		if order.product.id == cart_item["id"]
			order.order_items.each do |order_item|
				if cart_item["combo_options"].present?
					cart_item["combo_options"].each do |combo_option|
						if combo_option["combo_option_dishes"].present?
							combo_option["combo_option_dishes"].each do |combo_option_dish|
								if order_item.item.id == combo_option_dish["dish"]["id"]
									cart_order_item_count += 1
								end
							end
						end
					end
				end
			end
		end

		if order_item_count == cart_order_item_count
			return true
		else
			return false
		end
	end

	def generate_order_id
		order_id = nil
		begin 
			self.order_id = "OD" + Digest::SHA1.hexdigest(Time.now.to_s)[0..11]
			order_id = self.order_id
		end while self.class.exists?(order_id: self.order_id)
		self.save!
		self.order_id
	end

	def self.apply_promo_code(promo_code, cart, cart_promo)
		promo = Promo.find_by(code: promo_code) if promo_code
		user = User.find(cart[:user_id]) if cart[:user_id]
		# if user and promo and promo.users.pluck(:id).include?(user.id)
		# 	promo_user = promo.users.find(user.id)
		# else
		# 	promo_user = nil
		# end
		if promo.present? and promo.active and (cart_promo.present? ? cart_promo[:id] != promo.id : true)
			cart[:promo_id] = promo.id
			cart[:grand_total] = cart[:grand_total].to_f - (cart[:total].to_f * promo.discount_percentage)
			cart[:promo_discount] = cart[:total].to_f * promo.discount_percentage
			return true, cart[:promo_discount], cart
		else
			return false, 0, nil
		end
	end

	def apply_promo_code(promo_code)
		promo = Promo.find_by(code: promo_code) if promo_code
		user = User.find(self.user_id) if self.user_id
		# if user and promo and promo.users.pluck(:id).include?(user.id)
		# 	promo_user = promo.users.find(user.id)
		# else
		# 	promo_user = nil
		# end
		if promo.present? and promo.active
			self.promo_id = promo.id
			self.grand_total -= self.total * promo.discount_percentage
			self.promo_discount = self.total * promo.discount_percentage
			return true, self.promo_discount, self.grand_total
		else
			return false, 0
		end
	end

	def apply_mash_cash(mash_cash)
		user = User.find(self.user_id) if self.user_id
		if user.mash_cash > 150 and mash_cash > 0 and  mash_cash <= user.mash_cash
			self.mash_cash = mash_cash
			self.grand_total -= self.mash_cash
			return true, self.mash_cash, self.grand_total
		else
			return false, 0
		end
	end

	def set_payment_method(payment_method)
		self.payment_method = payment_method
		self.purchased_at = Time.now
		self.save!
	end

	def calculate_total
		self.total = orders.to_a.sum{|o| (o.order_items.to_a.sum{|oi| (oi.item.price * oi.quantity) || 0} * o.quantity) || 0}
		self.vat = 0.02 * self.total
		self.delivery_charge = self.total < 200 ? 30 : 40
		self.delivery_charge = 100 if self.total >= 1000
		self.grand_total = self.total + self.vat + self.delivery_charge
	end

	private
	def update_orders_for_save
		if self.purchased?	
			orders.each {|order| order.product.update_attributes! no_of_purchases: order.quantity; order.order_items.each{|order_item| order_item.item.update_attributes! no_of_purchases: (order_item.quantity*order_item.order.quantity)} }
		end
		return true
	end
end