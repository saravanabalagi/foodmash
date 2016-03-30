class RedoIndexesWithoutUniqueConstraint < ActiveRecord::Migration
  def change
  	remove_index :promos_users, [:promo_id, :user_id]
  	remove_index :promos_users, [:user_id, :promo_id]
  	add_index :promos_users, [:promo_id, :user_id]
  	add_index :promos_users, [:user_id, :promo_id]
  end
end
