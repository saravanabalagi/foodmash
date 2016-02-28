class AddDeliveryChargeToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :delivery_charge, :float
  end
end
