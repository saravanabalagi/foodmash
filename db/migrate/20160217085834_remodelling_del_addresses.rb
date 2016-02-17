class RemodellingDelAddresses < ActiveRecord::Migration
  def change
  	rename_column :delivery_addresses, :area, :area_id
  	change_column :delivery_addresses, :area_id, :integer
  	remove_column :delivery_addresses, :city
  end
end
