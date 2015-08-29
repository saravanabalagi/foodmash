class ApiApplicationController < ActionController::Base

	private 

  def authenticate_user_from_token!
    android_id = params[:auth_android_id]
    user_token = params[:auth_user_token].presence
    user = User.find_by(mobile_authentication_token: params[:mobile_auth_token])
    if user && user_token && android_id
      @current_user = user
    else
      permission_denied
    end
  end

  def permission_denied
    render status: 401, json: {error: "Unauthorized!"}
  end

end