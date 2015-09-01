class AddDobToUsers < ActiveRecord::Migration
  def change
  	add_column :users, :dob, :string
  end
end
