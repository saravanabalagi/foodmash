class SendOtpJob < ActiveJob::Base
  queue_as :default

  def perform(user)
  	user.send_sms("Hey " + user.name.split.first + ", \nUse this otp to verify your account - " + user.otp + "\nValid for only 5 minutes.")
  end
end
