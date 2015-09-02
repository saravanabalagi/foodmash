class DeliveryAddress < ActiveRecord::Base
	belongs_to :user
	has_many :cart_delivery_addresses
	has_many :carts, through: :cart_delivery_addresses
	validates :user_id, presence: true
	validates :contact_no, presence: true, numericality: {only_integer: true}
	validates_presence_of :latitude, :longitude, :pincode, :city, :area, :line1, primary: {default: false}
	before_save :falsify_true_records
	before_save :make_primary_for_first_address


	private
	def falsify_true_records
		user = User.find self.user_id
		user.delivery_addresses.where(primary: true).update_all(primary: false) if self.primary
		return true
	end

	def make_primary_for_first_address
		user = User.find self.user_id
		self.primary = true if user.delivery_addresses.count == 0 || user.delivery_addresses.count == 1
		return true
	end
end
