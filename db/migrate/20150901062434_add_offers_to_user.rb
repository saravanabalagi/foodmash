class AddOffersToUser < ActiveRecord::Migration
  def change
  	add_column :users, :offers, :boolean, default: true 
  end
end
