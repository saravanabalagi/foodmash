class CreateJoinTablePromoUser < ActiveRecord::Migration
  def change
    create_join_table :promos, :users do |t|
      t.index [:promo_id, :user_id], unique: true
      t.index [:user_id, :promo_id], unique: true
    end
  end
end
