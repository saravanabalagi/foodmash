class AddIndexToUsers < ActiveRecord::Migration
  def change
  	add_index :users, :user_token, unique: true
  	add_index :users, :mobile_no, unique: true
  end
end
