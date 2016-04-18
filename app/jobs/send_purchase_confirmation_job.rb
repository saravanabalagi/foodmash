class SendPurchaseConfirmationJob < ActiveJob::Base
  queue_as :default

  def perform(user, cart)
  	UserMailer.purchase_confirmation(user, cart).deliver_later!
  end
end
