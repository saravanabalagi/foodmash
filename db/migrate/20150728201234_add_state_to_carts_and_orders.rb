class AddStateToCartsAndOrders < ActiveRecord::Migration
  def change
  	add_column :carts, :aasm_state, :string
  	add_column :orders, :aasm_state, :string
  end
end
