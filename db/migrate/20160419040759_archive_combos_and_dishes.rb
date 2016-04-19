class ArchiveCombosAndDishes < ActiveRecord::Migration
  def change
  	add_column :combos, :archive, :boolean, default: false
  	add_column :dishes, :archive, :boolean, default: false
  end
end
