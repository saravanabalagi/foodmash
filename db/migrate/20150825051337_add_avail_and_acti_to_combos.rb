class AddAvailAndActiToCombos < ActiveRecord::Migration
  def change
  	add_column :combos, :active, :boolean, default: false
  	add_column :combos, :available, :boolean
  end
end
