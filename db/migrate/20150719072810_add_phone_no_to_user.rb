class AddPhoneNoToUser < ActiveRecord::Migration
  def change
  	add_column :users, :mobile_no, :string
  end
end
