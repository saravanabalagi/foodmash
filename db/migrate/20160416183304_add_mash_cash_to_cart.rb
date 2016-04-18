class AddMashCashToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :mash_cash, :float
  end
end
