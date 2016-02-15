class AddVatAndGrandTotalToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :vat, :float
  	add_column :carts, :grand_total, :float, default: 0.0
  end
end
