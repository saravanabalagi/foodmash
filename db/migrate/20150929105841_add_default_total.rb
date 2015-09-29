class AddDefaultTotal < ActiveRecord::Migration
  def change
  	change_column :carts, :total, :float, default: 0.00, null: false
  	change_column :orders, :total, :float, default: 0.00, null: false
  end
end
