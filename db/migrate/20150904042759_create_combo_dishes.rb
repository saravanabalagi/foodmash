class CreateComboDishes < ActiveRecord::Migration
  def change
    create_table :combo_dishes do |t|
      t.integer :combo_id
      t.integer :dish_id
      t.integer :dish_type_id

      t.timestamps null: false
    end
  end
end
