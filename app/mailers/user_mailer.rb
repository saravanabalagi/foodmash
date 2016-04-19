class UserMailer < ActionMailer::Base
	default from: 'info@foodmash.in'

	def signup_confirmation(user)
		@user = user
		mail to: @user.email, subject: 'We are thrilled you chose Foodmash!'
	end

	def purchase_confirmation(user, cart)
		@user, @cart = user, cart
		mail to: @user.email, subject: 'You have placed an order with Foodmash!'
	end

end