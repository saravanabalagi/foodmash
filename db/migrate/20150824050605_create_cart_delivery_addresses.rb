class CreateCartDeliveryAddresses < ActiveRecord::Migration
  def change
    create_table :cart_delivery_addresses do |t|
      t.integer :cart_id
      t.integer :delivery_address_id

      t.timestamps null: false
    end
  end
end
