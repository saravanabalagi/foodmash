class SendSignupConfirmationJob < ActiveJob::Base
  queue_as :default

  def perform(user)
  	UserMailer.signup_confirmation(user).deliver_later!
  end
end
