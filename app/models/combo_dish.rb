class ComboDish < ActiveRecord::Base
	belongs_to :combo
	belongs_to :dish
	belongs_to :dish_type
	validates_presence_of :combo_id, :dish_id, :dish_type_id
	after_save :call_label_on_combo

	private
	
	def call_label_on_combo
		self.combo.save!
	end
end
