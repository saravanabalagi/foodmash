class UserMailer < ActionMailer::Base
	default from: 'info@foodmash.in'

	def signup_confirmation(user)
		mail to: user.email, subject: 'We are thrilled you chose Foodmash!'
	end

end