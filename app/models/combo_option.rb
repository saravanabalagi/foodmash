class ComboOption < ActiveRecord::Base
	belongs_to :combo
	has_many :dishes, through: :combo_option_dishes
	has_many :combo_option_dishes, dependent: :destroy
	validates :combo_id, presence: true
	after_save :update_combo
	# before_destroy :ensure_combo_option_not_referenced

	private

	def update_combo
		self.combo.save!
	end
	
	# def ensure_combo_option_not_referenced
	# 	if order_items.empty?
	# 		return true
	# 	else
	# 		errors.add(:base, "Order Items present!")
	# 		return false
	# 	end
	# end
end
