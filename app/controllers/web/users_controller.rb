class Web::UsersController < ApplicationController
	respond_to :json
	before_filter :set_user, only: [:update, :add_role]
	load_and_authorize_resource skip_load_resource

	def index
		@users = User.where(params.permit(:id, :email))
		if @users
			render status: 200, json: @users.as_json(:include => {:roles => {:include => :resource}}, only: [:name, :email, :mobile_no])
		else
			render status: 404, json: {error: "User not found!"}
		end
	end

	def find_by_email
		@users = User.search_by_email(params[:email])
		if @users
			render status: 200, json: @users.as_json(only: [:name, :email, :mobile_no, :id])
		else
			render status: 404, json: {error: "User not found!"}
		end
	end

	def update
		if @user and @user.update_attributes(user_update_params)
			render status: 200, json: @user.as_json(:include => {:roles => {:include => :resource}}, only: [:name, :email, :mobile_no])
		else
			render status: 422, json: {error: @user.errors.as_json}
		end
	end

	def add_role
		resource = fetch_resource
		if @user and @user.add_role(params[:role_name], resource)
			render status: 200, json: @user.as_json(:include => {:roles => {:include => :resource}})
		else
			render status: 422, json: {error: "Failed to add role"}
		end
	end
	

	private 
	def fetch_resource
		if params[:role_name] == "restaurant_admin"
			resource = Restaurant.find params[:resource_id] if params[:resource_id]
			return resource
		elsif params[:role_name] == "packaging_centre_admin"
			resource = PackagingCentre.find params[:resource_id] if params[:resource_id]
			return resource
		elsif params[:role_name] == "super_admin"
			return nil
		end
	end

	def user_update_params
		params.require(:user).permit(:email, :name, :mobile_no)
	end
	
	def set_user
		@user = User.find params[:id]
	end
end