class Restaurant < ActiveRecord::Base
	resourcify
	before_save {|restaurant| write_attribute(:name, restaurant.name.split.each{|s| s[0] = s[0].upcase}.join(' '))}
	belongs_to :area
	has_many :dishes, dependent: :destroy
	has_many :dish_types, through: :dishes
	belongs_to :area
	validates_presence_of :area_id, :name
	before_destroy :ensure_restaurant_not_referenced
	before_save :ensure_logo_is_encoded


	def get_carts_for_restaurant
		carts_list = []
		if dishes.present?
			dishes.each do |dish|
				if dish.order_items.present?
					dish.order_items.each do |order_item|
						carts_list << order_item.order.cart
					end
				end
			end
		end
		return carts_list.flatten.uniq.select{|c| c.aasm_state != 'not_started'}
	end

	def has_combos
		combos = []
		if self.dishes.present?
	  	self.dishes.each {|dish|
	  	if dish.combo_options.present?
	  		 dish.combo_options.each {|combo_option|
	  		 	if combo_option.combo.present?
	  		 		combos << combo_option.combo 
	  		 	end
	  		 }
	  	end
	  	} 
	  end
	  
	  if self.dishes.present?
	  	self.dishes.each {|dish|
	  	if dish.combos.present?  
	  		combos << dish.combos
	  	end
	  	} 
	  end

	  return combos.flatten.uniq
  end

  def ensure_restaurant_not_referenced
  	if dishes.empty?
  		return true
  	else
  		check_for_dish_in_combos = false
  		dishes.each do |d|
  			if !d.combos.empty?
  				check_for_dish_in_combos = true
  			end
  		end
  		check_for_dish_in_combos == true ? return false : return true
  	end
  end

  private
  def ensure_logo_is_encoded
  	decoded_logo = URI.decode(self.logo) if self.logo.present?
    self.logo = URI.encode(decoded_logo) if self.logo.present?
    return true
  end
end