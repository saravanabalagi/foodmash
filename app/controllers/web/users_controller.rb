class Web::UsersController < ApplicationController
	respond_to :json
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	prepend_before_filter :authenticate_user_from_token!, only: [:get_otp, :verify_otp]
	before_filter :set_user, only: :update
	load_and_authorize_resource skip_load_resource

	def index
		@users = User.where(params.permit(:id, :email))
		if @users
			render status: 200, json: @users.as_json(:include => [{:roles => {:include => :resource}}], except: [:otp])
		else
			render status: 404, json: {error: "User not found!"}
		end
	end

	def find_by_email
		@users = User.search_by_email(params[:email])
		if @users
			render status: 200, json: @users.as_json(:include => {:roles => {:include => :resource}})
		else
			render status: 404, json: {error: "User not found!"}
		end
	end

	def send_otp
		if @current_user.set_otp
			SendOtpJob.set(wait: 5.seconds).perform_later(@current_user)
			MakeOtpNilJob.set(wait: 5.minutes).perform_later(@current_user)
			render status: 201, json: @current_user.as_json(:include => [{:roles => {:include => :resource}}], except: [:otp])
		else
			render status: 404, json: {error: "Was not able to send otp!"}
		end
	end

	def verify_otp
		if @current_user.otp == params[:otp] and ((Time.now - @current_user.otp_set) < 5.minutes) and @current_user.update_attributes!(verified: true)
			@current_user.reset_otp
			render status: 201, json: @current_user.as_json(:include => [{:roles => {:include => :resource}}], except: [:otp])
		else
			render status: 422, json: {error: 'Account was not verified'}
		end
	end

	def change_password
		if @current_user and @current_user.valid_password? params[:data][:user][:old_password]
			@current_user.password = params[:data][:user][:password]
			@current_user.password_confirmation = params[:data][:user][:password_confirmation]
			@current_user.save
			render status: 201, json: {success: true, message: "Password was successfully changed!"}
		else
			render status: 200, json: {success: false, error: "Could not change password!"}
		end
	end

	def update
		if @user and @user.update_attributes!(user_update_params)
			render status: 200, json: @user.as_json(:include => [{:roles => {:include => :resource}}], except: [:otp])
		else
			render status: 422, json: {error: @user.errors.as_json}
		end
	end

	def add_role
		@user = User.find params[:user][:id]
		resource = fetch_resource
		if @user and @user.add_role(params[:user][:role_name], resource)
			render status: 200, json: @user.as_json(:include => [{:roles => {:include => :resource}}], except: [:otp])
		else
			render status: 422, json: {error: "Failed to add role"}
		end
	end

	def remove_role
		@user = User.find params[:user][:id]
		resource = fetch_resource
		if @user and @user.remove_role(params[:user][:role_name], resource)
			render status: 200, json: @user.as_json(:include => [{:roles => {:include => :resource}}], except: [:otp])
		else
			render status: 422, json: {error: "Failed to remove role!"}
		end
	end
	

	private 
	def fetch_resource
		if params[:user][:role_name] == "restaurant_admin"
			resource = Restaurant.find params[:user][:resource_id] if params[:user][:resource_id]
			return resource
		elsif params[:user][:role_name] == "packaging_centre_admin"
			resource = PackagingCentre.find params[:user][:resource_id] if params[:user][:resource_id]
			return resource
		elsif params[:user][:role_name] == "super_admin" or params[:user][:role_name] == "customer"
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