class RemodellingDelAddresses < ActiveRecord::Migration
  def change
  	change_column :delivery_addresses, :area, :integer
  	rename_column :delivery_addresses, :area, :area_id
  	remove_column :delivery_addresses, :city
  end
end
