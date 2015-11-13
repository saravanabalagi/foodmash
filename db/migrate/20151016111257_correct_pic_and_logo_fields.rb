class CorrectPicAndLogoFields < ActiveRecord::Migration
  def change
  	rename_column :combos, :picture_url, :picture
  	rename_column :restaurants, :picture_url, :picture
  	rename_column :restaurants, :logo_url, :logo
  	rename_column :dishes, :picture_url, :picture
  end
end
