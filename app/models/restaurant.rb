class Restaurant < ActiveRecord::Base
	resourcify
	has_many :contacts, as: :owner
	has_many :dishes
end