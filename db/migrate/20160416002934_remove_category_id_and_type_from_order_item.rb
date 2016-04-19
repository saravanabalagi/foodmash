class RemoveCategoryIdAndTypeFromOrderItem < ActiveRecord::Migration
  def change
  	remove_column :order_items, :category_id
  	remove_column :order_items, :category_type
  end
end
