class AddAvailToDishes < ActiveRecord::Migration
  def change
  	add_column :dishes, :available, :boolean, default: true
  end
end
