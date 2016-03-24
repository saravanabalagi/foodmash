class DeliveryAddress < ActiveRecord::Base
	belongs_to :user
	belongs_to :area
	has_many :carts
	validates :user_id, presence: true
	validates_presence_of :area_id, :line1, primary: {default: false}
	before_save :falsify_true_records
	# before_save :make_primary_for_first_address
	before_destroy :make_primary_for_first_address

	def self.make_primary(delivery_address_id)
		delivery_address = DeliveryAddress.find delivery_address_id
		delivery_address.primary = true
		delivery_address.save!
	end

	private
	def falsify_true_records
		user = User.find self.user_id
		user.delivery_addresses.where(primary: true).update_all(primary: false) if (self.primary and self.primary_changed?)
		return true
	end

	# def make_primary_for_first_address
	# 	user = User.find self.user_id
	# 	if user.delivery_addresses.count == 0
	# 		self.primary = true 
	# 	else
	# 		user.delivery_addresses.where("id != ?", self.id).first.update_column(:primary, true) if (!self.primary and user.delivery_addresses.where("id != ?", self.id).pluck(:primary).uniq == [false])
	# 	end
	# 	return true
	# end
end
