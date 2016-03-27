class ChangePromoUsersTableName < ActiveRecord::Migration
  def change
  	rename_table :Promos_Users, :promos_users
  end
end
