class ModifyDeliveryAddresses < ActiveRecord::Migration
  def change
  	rename_column :delivery_addresses, :address, :line1
  	add_column :delivery_addresses, :line2, :text
  	add_column :delivery_addresses, :name, :string
  	add_column :delivery_addresses, :area, :string
  	rename_column :delivery_addresses, :pin_code, :pincode
  	add_column :delivery_addresses, :primary, :boolean, default: false
  	add_column :delivery_addresses, :latitude, :decimal, precision: 10, scale: 6
  	add_column :delivery_addresses, :longitude, :decimal, precision: 10, scale: 6
  end
end
