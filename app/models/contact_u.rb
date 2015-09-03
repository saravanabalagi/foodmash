class ContactU < ActiveRecord::Base
	belongs_to :user
	validates_presence_of :issue, :description, :user_id
end
