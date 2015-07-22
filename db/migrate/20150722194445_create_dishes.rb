class CreateDishes < ActiveRecord::Migration
  def change
    create_table :dishes do |t|
      t.string :name
      t.string :picture_url
      t.float :price
      t.integer :dish_type
      t.integer :restaurant_id
      t.integer :no_of_purchases, default: 0

      t.timestamps null: false
    end
  end
end
