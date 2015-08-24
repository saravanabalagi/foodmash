class AddContactNoToDeliveryAddress < ActiveRecord::Migration
  def change
  	add_column :delivery_addresses, :contact_no, :string
  end
end
