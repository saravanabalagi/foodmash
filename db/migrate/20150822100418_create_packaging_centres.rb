class CreatePackagingCentres < ActiveRecord::Migration
  def change
    create_table :packaging_centres do |t|
      t.string :name
      t.text :address
      t.decimal :latitude, precision: 10, scale: 6
      t.decimal :longitude, precision: 10, scale: 6

      t.timestamps null: false
    end
  end
end
