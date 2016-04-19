class RemoveDishTypeFromComboOptions < ActiveRecord::Migration
  def change
  	remove_column :combo_options, :dish_type_id
  end
end
