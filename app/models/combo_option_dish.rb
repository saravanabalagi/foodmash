class ComboOptionDish < ActiveRecord::Base
	belongs_to :combo_option
	belongs_to :dish
	validates :dish_id, presence: true
	validates :combo_option_id, presence: true
end
