class AddNoteToOrderItems < ActiveRecord::Migration
  def change
    add_column :order_items, :note, :text
  end
end
