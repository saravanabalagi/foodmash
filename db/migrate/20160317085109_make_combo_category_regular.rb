class MakeComboCategoryRegular < ActiveRecord::Migration
  def change
  	change_column_default :combos, :category, 'Regular'
  end
end
