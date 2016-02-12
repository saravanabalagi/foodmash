class AddMinCountToComboEntities < ActiveRecord::Migration
  def change
  	add_column :combo_dishes, :min_count, :integer, default: 1
  	add_column :combo_options, :min_count, :integer, default: 1
  end
end
