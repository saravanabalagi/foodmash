class AddStateToOrderItems < ActiveRecord::Migration
  def change
  	add_column :order_items, :aasm_state, :string
  end
end
