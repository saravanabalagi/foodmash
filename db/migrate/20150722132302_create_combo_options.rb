class CreateComboOptions < ActiveRecord::Migration
  def change
    create_table :combo_options do |t|
      t.string :name
      t.integer :combo_id
      t.integer :dish_type

      t.timestamps null: false
    end
  end
end
