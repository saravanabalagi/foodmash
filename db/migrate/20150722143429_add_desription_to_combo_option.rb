class AddDesriptionToComboOption < ActiveRecord::Migration
  def change
  	add_column :combo_options, :description, :text
  end
end
