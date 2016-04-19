class AddCompulsoryBooleanToComboOptions < ActiveRecord::Migration
  def change
  	add_column :combo_options, :compulsory, :boolean, default: false
  end
end
