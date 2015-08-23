class AddToUser < ActiveRecord::Migration
  def change
  	add_column :users, :mobile_authentication_token, :string
  end
end
