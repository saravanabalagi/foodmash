class CreatePromos < ActiveRecord::Migration
  def change
    create_table :promos do |t|
      t.string :code
      t.boolean :active, default: true

      t.timestamps null: false
    end
  end
end
