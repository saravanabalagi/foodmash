class Changecodetointeger < ActiveRecord::Migration
  def change
  	change_column :versions, :version_code, :integer, default: 0
  end
end
