class CreateCombos < ActiveRecord::Migration
  def change
    create_table :combos do |t|
      t.string :name
      t.float :price
      t.integer :group_size
      t.integer :no_of_purchases, default: 0

      t.timestamps null: false
    end
  end
end
