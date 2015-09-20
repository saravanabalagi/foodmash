class AddDeliveryAddressIdToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :delivery_address_id, :integer
  end
end
