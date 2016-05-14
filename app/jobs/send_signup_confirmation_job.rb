class SendSignupConfirmationJob < ActiveJob::Base
  queue_as :default

  def perform(user)
  	UserMailer.signup_confirmation(user).deliver_later!
    user.send_sms("Welcome to the Foodmash experience, you are going to love it!")
  end
end
