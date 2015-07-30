class AddDescriptionToCombo < ActiveRecord::Migration
  def change
    add_column :combos, :description, :string
  end
end
