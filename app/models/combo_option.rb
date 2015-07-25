class ComboOption < ActiveRecord::Base
	has_one :dish_type
	belongs_to :combo
	has_many :combo_option_dishes
	validates :dish_type_id, presence: true
end
