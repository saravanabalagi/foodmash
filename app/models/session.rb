class Session < ActiveRecord::Base
	validates_presence_of :user_id, :session_token
	belongs_to :user
end
