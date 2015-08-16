class ApiApplicationController < ActionController::Base

	private 

  def authenticate_user_from_token!
    android_id = params[:auth_android_id]
    user_id = params[:auth_user_id].presence
    user = User.find_by(authentication_token: params[:auth_token])
    if user && user_id && android_id
      @current_user = user
    else
      permission_denied
    end
  end

  def permission_denied
    render status: 401, json: {error: "Unauthorized!"}
  end

end