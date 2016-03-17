class Changecodetointeger < ActiveRecord::Migration
  def change
  	change_column :versions, :version_code, 'integer USING CAST(version_code AS integer)', default: 0
  end
end
