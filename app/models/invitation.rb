class Invitation < ActiveRecord::Base
	belongs_to :sender, polymorphic: true
	has_one :recipient, class_name: "User"
	validates :recipient_email, presence: true, format: {with: /\A[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+\z/}, uniqueness: true
	before_create :generate_token
	before_create :check_if_recipient_not_registered

	private 
	def check_if_recipient_not_registered
		if User.find_by(email: self.recipient_email).present?
			return false
		end
		return true
	end

	def generate_token
		token = nil
		begin
			self.token = Digest::SHA1.hexdigest(Time.now.to_s)
			token = self.token
		end while self.class.exists?(token: self.token)
		return token
	end
end
