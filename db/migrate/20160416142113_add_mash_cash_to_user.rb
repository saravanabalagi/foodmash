class AddMashCashToUser < ActiveRecord::Migration
  def change
  	add_column :users, :mash_cash, :float, default: 0.0
  end
end
