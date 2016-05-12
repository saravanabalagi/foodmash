class SendPurchaseConfirmationJob < ActiveJob::Base
  queue_as :default

  def perform(user, cart)
  	UserMailer.purchase_confirmation(user, cart).deliver_later!
  	user.send_sms('Order worth Rs ' + cart.grand_total.to_s + ' confirmed. Thank you for choosing Foodmash :)')
  end
end
