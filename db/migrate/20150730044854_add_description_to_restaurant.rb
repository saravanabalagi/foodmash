class AddDescriptionToRestaurant < ActiveRecord::Migration
  def change
    add_column :restaurants, :description, :text
    change_column :combos, :description, :text
  end
end
