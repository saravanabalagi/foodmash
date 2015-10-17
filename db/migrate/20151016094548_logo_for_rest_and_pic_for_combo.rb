class LogoForRestAndPicForCombo < ActiveRecord::Migration
  def change
  	add_column :combos, :picture_url, :string
  	add_column :restaurants, :logo_url, :string
  end
end
