class Combo < ActiveRecord::Base
	belongs_to :packaging_centre
	has_many :combo_dishes, dependent: :destroy
	has_many :combo_options, dependent: :destroy
	has_many :combo_option_dishes, through: :combo_options, dependent: :destroy
	validates :price, presence: true, numericality: {greater_than: 0}
	has_many :orders, as: :product
	before_destroy :ensure_combo_not_referenced
	before_save :check_for_availability

	def check_for_availability
		if self.combo_options.count > 0
			combo_options_list = []
			self.combo_options.each do |combo_option|
			 	if combo_option.dishes.pluck(:available).include? true
			 	  combo_options_list.append true
			 	else
			 	  combo_options_list.append false
			 	end
			end
			self.available = (combo_options_list.uniq == [true])
		else
			self.available = false
		end
		return true
	end

	def label
		dishes = []
		self.combo_dishes.each {|combo_dish| dishes << combo_dish.dish}
		self.combo_options.each { |combo_option| dishes << combo_option.dishes }
		labels = dishes.flatten.map(&:label)
		if labels.include? "non-veg"
			return "non-veg"
		elsif labels.include? "egg"
			return "egg"
		else
			return "veg"
		end
	end

	private
	def ensure_combo_not_referenced
		if orders.empty?
			return true
		else
			errors.add(:base, "Orders present!")
			return false
		end
	end
end
