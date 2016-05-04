class AddAwardedMashCashToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :awarded_mash_cash, :float, default: 0.0
  end
end
