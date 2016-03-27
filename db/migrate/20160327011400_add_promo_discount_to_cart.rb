class AddPromoDiscountToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :promo_discount, :float
  end
end
