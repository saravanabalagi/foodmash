class DeliveryAddress < ActiveRecord::Base
	belongs_to :user
	has_many :carts
	validates :user_id, presence: true
	validates :contact_no, presence: true, numericality: {only_integer: true}
	validates_presence_of :pincode, :city, :area, :line1, primary: {default: false}
	before_save :falsify_true_records
	before_save :make_primary_for_first_address
	before_destroy :choose_first_as_primary


	private
	def falsify_true_records
		user = User.find self.user_id
		user.delivery_addresses.where(primary: true).update_all(primary: false) if self.primary
		return true
	end

	def make_primary_for_first_address
		user = User.find self.user_id
		self.primary = true if user.delivery_addresses.count == 0
		return true
	end

	def choose_first_as_primary
		user = User.find self.user_id
		user.delivery_addresses.where("id != ?", self.id).first.update_attributes(primary: true) if user.delivery_addresses.where("id != ?", self.id).pluck(:primary).uniq == [false]
		return true
	end
end
