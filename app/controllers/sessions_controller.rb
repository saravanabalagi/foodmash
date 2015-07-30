class SessionsController < Devise::SessionsController
	before_filter :configure_sign_in_params, only: [:create]
	skip_before_filter :verify_authenticity_token, :verify_signed_out_user
  before_filter :authenticate_user!, except: [:create]
  before_filter :authenticate_user_from_token!, only: [:destroy]
  
	respond_to :json

	 def create
    resource = User.find_for_database_authentication(email: params[:user][:email]) || User.find_for_database_authentication(mobile_no: params[:user][:mobile_no])
    return failure unless resource
    return failure unless resource.valid_password?(params[:user][:password])
    sign_in(resource)
    render status: 200,
      json: {
        success: true, info: "Logged in", data: {
          user: resource,
          auth_token: resource.authentication_token
        }
      }
  end

  def failure 
    warden.custom_failure! 
    render status: 200,
    json: {
      success: false, info: "Login failed", data: {}
    }
  end 

  def destroy
    return permission_denied unless params[:auth_user_id].to_s == @current_user.id.to_s

    resource = User.find_for_database_authentication(id: params[:auth_user_id])
    return failure unless resource
    resource.clear_authentication_token
    sign_out(resource)
    render status: 200, json: {success: true, info: 'Logged Out'}
  end

	private
	 def configure_sign_in_params
	   devise_parameter_sanitizer.for(:sign_in) { |u| u.permit(:email, :mobile_no, :password) }
	 end
end