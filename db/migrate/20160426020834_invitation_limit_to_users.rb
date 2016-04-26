class InvitationLimitToUsers < ActiveRecord::Migration
  def change
  	add_column :users, :invitation_limit, :integer,default: 0
  end
end
