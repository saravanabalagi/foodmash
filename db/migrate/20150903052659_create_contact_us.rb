class CreateContactUs < ActiveRecord::Migration
  def change
    create_table :contact_us do |t|
      t.integer :user_id
      t.string :issue
      t.text :description

      t.timestamps null: false
    end
  end
end
