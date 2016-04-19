class RemoveCompulsoryAndAddMinCount < ActiveRecord::Migration
  def change
  	remove_column :combo_options, :compulsory
  	change_column :combo_options, :min_count, :integer, default: 0
  end
end
