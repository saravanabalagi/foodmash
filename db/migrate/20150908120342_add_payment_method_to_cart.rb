class AddPaymentMethodToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :payment_method, :string
  	add_column :carts, :order_id, :string
  end
end
