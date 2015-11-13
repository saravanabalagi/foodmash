class AddNotNullQuantity < ActiveRecord::Migration
  def change
  	change_column :orders, :quantity, :integer, null: false
  	change_column :order_items, :quantity, :integer, null: false
  end
end
