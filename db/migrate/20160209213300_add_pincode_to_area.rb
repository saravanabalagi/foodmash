class AddPincodeToArea < ActiveRecord::Migration
  def change
  	add_column :areas, :pincode, :integer
  	remove_column :delivery_addresses, :pincode
  end
end
