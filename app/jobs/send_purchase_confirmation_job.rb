class SendPurchaseConfirmationJob < ActiveJob::Base
  queue_as :default

  def perform(user, cart)
  	UserMailer.purchase_confirmation(user, cart).deliver_later!
  	user.send_sms('Hey, '+ user.name.first +' thank you for choosing Foodmash :) ' + 'Your order worth Rs ' + cart.grand_total.to_s + ' has been confirmed.' + 'We would love to serve you again!')
  end
end
