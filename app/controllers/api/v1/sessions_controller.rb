class Api::V1::SessionsController < ApiApplicationController
	before_filter :configure_sign_in_params, only: [:create]
	before_filter :authenticate_user_from_token!, only: [:destroy]
	before_filter :check_for_android!, only: [:create, :destroy]
	respond_to :json

	 def create
	  resource = User.find_for_database_authentication(email: params[:user][:email]) || User.find_for_database_authentication(mobile_no: params[:user][:mobile_no])
	  return failure unless resource
	  return failure unless resource.valid_password?(params[:user][:password])
	  render status: 200,
	    json: {
	      success: true, 
        user_token: resource.user_token,
        mobile_token: resource.mobile_authentication_token
	    }
	end

	def failure 
	  render status: 200,
	  json: {
	    success: false
	  }
	end 

	def destroy
	  return permission_denied unless params[:auth_user_token] == @current_user.user_token

	  resource = User.find_for_database_authentication(user_token: params[:auth_user_token])
	  return failure unless resource
	  resource.clear_mobile_authentication_token
	  render status: 200, 
	  json: {
	  	success: true
	 }
	end

	private
	 def configure_sign_in_params
	   params.require(:user).permit(:email, :password, :mobile_no)
	 end
end