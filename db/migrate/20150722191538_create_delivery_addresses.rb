class CreateDeliveryAddresses < ActiveRecord::Migration
  def change
    create_table :delivery_addresses do |t|
      t.integer :user_id
      t.text :address
      t.string :city
      t.integer :pin_code

      t.timestamps null: false
    end
  end
end
