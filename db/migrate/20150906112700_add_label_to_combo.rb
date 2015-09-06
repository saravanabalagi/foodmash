class AddLabelToCombo < ActiveRecord::Migration
  def change
  	add_column :combos, :label, :string
  end
end
