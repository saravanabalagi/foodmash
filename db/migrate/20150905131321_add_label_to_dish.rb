class AddLabelToDish < ActiveRecord::Migration
  def change
  	add_column :dishes, :label, :string
  	add_column :dishes, :cuisine_id, :integer
  end
end
