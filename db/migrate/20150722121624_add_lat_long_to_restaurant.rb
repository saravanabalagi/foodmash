class AddLatLongToRestaurant < ActiveRecord::Migration
  def change
  	add_column :restaurants, :latitude, :decimal, {precision: 10, scale: 6}
  	add_column :restaurants, :longitude, :decimal, {precision: 10, scale: 6}
  end
end
