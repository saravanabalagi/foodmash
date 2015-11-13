class ComboOptionDish < ActiveRecord::Base
	belongs_to :combo_option
	belongs_to :dish
	validates :dish_id, presence: true
	validates :combo_option_id, presence: true
	after_save :call_label_on_combo

	private
	
	def call_label_on_combo
		self.combo_option.combo.save!
	end
end
