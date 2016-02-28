class Makevatzero < ActiveRecord::Migration
  def change
  	change_column :carts, :vat, :float, default: 0.0
  end
end
