class RearchitectVersions < ActiveRecord::Migration
  def change
  	rename_column :versions, :name, :version_name
  	add_column :versions, :version_code, :integer
  end
end
