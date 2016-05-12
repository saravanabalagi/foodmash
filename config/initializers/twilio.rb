require 'twilio-ruby'

Twilio.configure do |config|
  config.account_sid = ENV['twilio-account-sid']
  config.auth_token = ENV['twilio-auth-token']
end