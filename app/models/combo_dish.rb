class ComboDish < ActiveRecord::Base
	belongs_to :combo
	belongs_to :dish
	belongs_to :dish_type
	validates_presence_of :combo_id, :dish_id, :dish_type_id
	after_save :update_combo
	# before_destroy :ensure_combo_dish_not_referenced

	private
	
	def update_combo
		self.combo.save!
	end

	# def ensure_combo_dish_not_referenced
	# 	if order_items.empty?
	# 		return true
	# 	else
	# 		errors.add(:base, "Order Items present!")
	# 		return false
	# 	end
	# end
end
