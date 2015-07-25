class Combo < ActiveRecord::Base
	has_many :combo_options, dependent: :destroy
	has_many :combo_option_dishes, through: :combo_options, dependent: :destroy
	validates :price, presence: true, numericality: {greater_than: 0}
	has_many :orders, as: :product
	before_destroy :ensure_combo_not_referenced

	private
	def ensure_combo_not_referenced
		if orders.empty?
			return true
		else
			errors.add(:base, "Order items present!")
			return false
		end
	end
end
