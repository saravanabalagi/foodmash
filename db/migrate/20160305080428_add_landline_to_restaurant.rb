class AddLandlineToRestaurant < ActiveRecord::Migration
  def change
  	add_column :restaurants, :landline, :string
  end
end
