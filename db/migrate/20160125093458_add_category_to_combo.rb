class AddCategoryToCombo < ActiveRecord::Migration
  def change
  	add_column :combos, :category, :text, default: 'regular'
  end
end
