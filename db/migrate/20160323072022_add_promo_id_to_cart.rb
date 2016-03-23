class AddPromoIdToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :promo_id, :integer
  end
end
