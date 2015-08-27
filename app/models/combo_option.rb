class ComboOption < ActiveRecord::Base
	belongs_to :dish_type
	has_many :dishes, through: :combo_option_dishes
	belongs_to :combo
	has_many :combo_option_dishes, dependent: :destroy
	validates :dish_type_id, presence: true
	validates :combo_id, presence: true
end
