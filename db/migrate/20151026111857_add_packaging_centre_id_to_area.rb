class AddPackagingCentreIdToArea < ActiveRecord::Migration
  def change
  	add_column :areas, :packaging_centre_id, :integer
  end
end
