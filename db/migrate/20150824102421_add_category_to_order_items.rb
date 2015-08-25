class AddCategoryToOrderItems < ActiveRecord::Migration
  def change
  	add_column :order_items, :category_id, :integer
  	add_column :order_items, :category_type, :string
  end
end
