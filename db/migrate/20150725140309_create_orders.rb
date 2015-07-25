class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.integer :product_id
      t.string :product_type
      t.integer :quantity, default: 1
      t.float :total
      t.integer :cart_id

      t.timestamps null: false
    end
  end
end
