class Combo < ActiveRecord::Base
	has_many :combo_options
	has_many :combo_options_dishes, through: :combo_options
	validates :price, presence: true, numericality: {greater_than: 0}
end
