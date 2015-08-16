class Web::UsersController < ApplicationController
	before_filter :set_user, on: :update
	respond_to :json

	def index
		@users = User.where(params.permit(:id, :email))
		if @users
			render status: 200, json: @users.as_json		
		else
			render status: 404, json: {error: "User not found!"}
		end
	end

	def update
		if @user and @user.update_attributes(user_update_params)
			render status: 200, json: @user.as_json
		else
			render status: 422, json: {error: @user.errors.as_json}
		end
	end
	

	private 
	def user_update_params
		params.require(:user).permit(:email, :name, :mobile_no)
	end
	def set_user
		@user = User.find params[:id]
	end
end