class AddCustomizableToCombos < ActiveRecord::Migration
  def change
  	add_column :combos, :customizable, :boolean, default: false
  end
end
