class GeneratePercentageForPromo < ActiveRecord::Migration
  def change
  	add_column :promos, :discount_percentage, :float, default: 0.0
  end
end
