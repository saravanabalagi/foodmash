class RearchitectVersions < ActiveRecord::Migration
  def change
  	change_column :versions, :name, :version_name
  	add_column :versions, :version_code, :string
  end
end
