class AddFieldsToCart < ActiveRecord::Migration
  def change
  	add_column :carts, :mihpayid, :string
  	add_column :carts, :payment_status, :string
  	add_column :carts, :payment_card_category, :string
  	add_column :carts, :payment_source, :string
  	add_column :carts, :pg_type, :string
  	add_column :carts, :bank_ref_num, :string
  	add_column :carts, :bankcode, :string
  	add_column :carts, :payment_error, :string
  	add_column :carts, :payment_error_message, :string
  	add_column :carts, :payment_name_on_card, :string
  	add_column :carts, :payment_card_no, :string
  	add_column :carts, :issuing_bank, :string
  	add_column :carts, :payment_card_type, :string
  end
end
