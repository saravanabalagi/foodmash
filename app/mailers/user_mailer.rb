class UserMailer < ActionMailer::Base
	default from: 'team@foodmash.in'

	def signup_confirmation(user)
		mail to: user.email, subject: 'Welcome to the FoodMash experience, you are going to love it!'
	end

end