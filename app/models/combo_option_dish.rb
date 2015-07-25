class ComboOptionDish < ActiveRecord::Base
	belongs_to :combo_option
	has_one :dish
	validates :dish_id, presence: true
end
