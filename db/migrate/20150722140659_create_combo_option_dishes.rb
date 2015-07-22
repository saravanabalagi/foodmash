class CreateComboOptionDishes < ActiveRecord::Migration
  def change
    create_table :combo_option_dishes do |t|
      t.integer :combo_option_id
      t.integer :dish_id

      t.timestamps null: false
    end
  end
end
