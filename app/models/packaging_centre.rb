class PackagingCentre < ActiveRecord::Base
	resourcify
	before_save {|centre| write_attribute(:name, centre.name.split.each{|s| s[0] = s[0].upcase}.join(' '))}
	has_many :combos
	has_many :areas
	validates_presence_of :name
	validates_uniqueness_of :name

	def get_carts_for_centre
		carts_list = []
		if combos.present?
			combos.each do |combo|
				if combo.orders.present?
					combo.orders.each do |order|
						carts_list << order.cart
					end
				end
			end
		end
		return carts_list.flatten.uniq.select{|c| c.aasm_state != 'not_started'}
	end

end
