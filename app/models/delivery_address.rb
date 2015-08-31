class DeliveryAddress < ActiveRecord::Base
	belongs_to :user
	has_many :cart_delivery_addresses
	has_many :carts, through: :cart_delivery_addresses
	validates :user_id, presence: true
	validates :contact_no, presence: true, numericality: {only_integer: true}
	validates_presence_of :latitude, :longitude, :pincode, :city, :area, :line1, :primary
	before_save :falsify_true_records


	private
	def falsify_true_records
		self.class.where(primary: true).update_all(primary: false) if self.primary
	end

end
