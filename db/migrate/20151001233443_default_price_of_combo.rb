class DefaultPriceOfCombo < ActiveRecord::Migration
  def change
  	change_column :combos, :price, :float,default: 0.0
  end
end
