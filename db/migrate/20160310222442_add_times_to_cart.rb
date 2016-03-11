class AddTimesToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :ordered_at, :datetime
  	add_column :carts, :dispatched_at, :datetime
  	add_column :carts, :delivered_at, :datetime
  end
end
