class ApiApplicationController < ActionController::Base
  
	private 

  def check_for_android_id!
    android_id = params[:android_id]
    return android_denied unless android_id
  end

  def authenticate_user_from_token!
    android_token = params[:auth_android_token]
    user_token = params[:auth_user_token].presence
    user = User.find_by(mobile_authentication_token: params[:auth_session_token])
    if user && user_token && android_token
      @current_user = user
    else
      permission_denied
    end
  end

  def permission_denied
    render status: 401, json: {error: "Unauthorized!"}
  end

  def android_denied
    render status: 401, json: {error: "Android Id is invalid or absent!"}
  end

end