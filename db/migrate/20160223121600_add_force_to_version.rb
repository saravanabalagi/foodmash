class AddForceToVersion < ActiveRecord::Migration
  def change
  	add_column :versions, :force, :boolean, default: false
  end
end
