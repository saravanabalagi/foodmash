class AddPriorityToComboOptionAndComboDishes < ActiveRecord::Migration
  def change
  	add_column :combo_options, :priority, :integer
  	add_column :combo_dishes, :priority, :integer
  end
end
