class CreateComboOptionDishes < ActiveRecord::Migration
  def change
    create_table :combo_option_dishes, id: false do |t|
      t.integer :combo_option_id
      t.integer :dish_id
    end
  end
end
