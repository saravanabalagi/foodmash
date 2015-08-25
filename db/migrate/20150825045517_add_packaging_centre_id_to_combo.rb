class AddPackagingCentreIdToCombo < ActiveRecord::Migration
  def change
  	add_column :combos, :packaging_centre_id, :integer
  end
end
