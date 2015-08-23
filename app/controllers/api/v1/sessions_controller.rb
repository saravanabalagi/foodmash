class Api::V1::SessionsController < ApiApplicationController
	before_filter :configure_sign_in_params, only: [:create]
	before_filter :authenticate_user_from_token!, only: [:destroy]
	respond_to :json

	 def create
	  resource = User.find_for_database_authentication(email: params[:user][:email]) || User.find_for_database_authentication(mobile_no: params[:user][:mobile_no])
	  return failure unless resource
	  return failure unless resource.valid_password?(params[:user][:password])
	  resource.clear_mobile_authentication_token
	  render status: 200,
	    json: {
	      success: true, info: "Logged in", data: {
	        user: resource.as_json(except: :authentication_token),
	        mobile_auth_token: resource.mobile_authentication_token
	      }
	    }
	end

	def failure 
	  render status: 200,
	  json: {
	    success: false, info: "Login failed", data: {}
	  }
	end 

	def destroy
	  return permission_denied unless params[:auth_user_id].to_s == @current_user.id.to_s

	  resource = User.find_for_database_authentication(id: params[:auth_user_id])
	  return failure unless resource
	  render status: 200, json: {success: true, info: 'Logged Out'}
	end

	private
	 def configure_sign_in_params
	   params.require(:user).permit(:email, :password, :mobile_no)
	 end
end