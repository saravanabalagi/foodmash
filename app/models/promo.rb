class Promo < ActiveRecord::Base
	before_save {|promo| write_attribute(:code, promo.code.downcase)}
	has_and_belongs_to_many :users, :class_name => "PromosUsers"
end
