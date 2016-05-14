class SendPurchaseConfirmationJob < ActiveJob::Base
  queue_as :default

  def perform(user, cart)
  	UserMailer.purchase_confirmation(user, cart).deliver_later!
  	user.send_sms("Hey "+ user.name.split.first + ", \nThank you for choosing Foodmash :) " + "\nYour order worth Rs " + cart.grand_total.to_s + " has been confirmed.\n" + "We would love to serve you again!")
  end
end
