class AddDefaultToDelCharge < ActiveRecord::Migration
  def change
  	change_column :carts, :delivery_charge, :float, default: 0.0
  end
end
