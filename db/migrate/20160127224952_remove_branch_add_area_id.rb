class RemoveBranchAddAreaId < ActiveRecord::Migration
  def change
  	remove_column :restaurants, :branch
  	add_column :restaurants, :area_id, :integer
  end
end
