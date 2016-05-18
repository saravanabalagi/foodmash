class AddOtpSetToUser < ActiveRecord::Migration
  def change
  	add_column :users, :otp_set, :datetime, default: nil
  end
end
