class AddUnmappedstatusToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :payment_unmappedstatus, :string
  end
end
