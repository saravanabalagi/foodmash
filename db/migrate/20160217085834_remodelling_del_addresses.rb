class RemodellingDelAddresses < ActiveRecord::Migration
  def change
  	remove_column :delivery_addresses, :area
  	add_column :delivery_addresses, :area_id, :integer
  	remove_column :delivery_addresses, :city
  end
end
