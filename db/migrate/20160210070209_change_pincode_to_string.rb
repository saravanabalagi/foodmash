class ChangePincodeToString < ActiveRecord::Migration
  def change
  	change_column :areas, :pincode, :string
  end
end
