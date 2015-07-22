class AddBranchToRestaurant < ActiveRecord::Migration
  def change
    add_column :restaurants, :branch, :string
  end
end
