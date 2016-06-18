class MakeOtpNilJob < ActiveJob::Base
  queue_as :default

  def perform(user)
  	user.reset_otp
  end
end
