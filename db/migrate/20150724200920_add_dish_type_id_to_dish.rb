class AddDishTypeIdToDish < ActiveRecord::Migration
  def change
  	rename_column :dishes, :dish_type, :dish_type_id
  end
end
