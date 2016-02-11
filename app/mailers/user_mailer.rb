class UserMailer < ActionMailer::Base
	default from: 'praveen@foodmash.in'

	def signup_confirmation(user)
		mail to: user.email, subject: 'We are thrilled you chose Foodmash!'
	end

end