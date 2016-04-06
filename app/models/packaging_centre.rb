class PackagingCentre < ActiveRecord::Base
	resourcify
	before_save {|centre| write_attribute(:name, centre.name.split.each{|s| s[0] = s[0].upcase}.join(' '))}
	has_many :combos
	has_many :areas
	validates_presence_of :name
	validates_uniqueness_of :name

	def get_carts_for_centre
		carts_list = Cart.where(purchased_at: Time.now.beginning_of_month..Time.now.end_of_month).where.not(aasm_state: 'not_started')
		packaging_centre_ids = []
		carts_list.each{|cart| cart.orders.each{|order| packaging_centre_ids << order.product.packaging_centre_id}}
		return carts_list.uniq if (packaging_centre_ids.uniq.length == 1 and packaging_centre_ids.uniq.include? self.id)
	end

end
