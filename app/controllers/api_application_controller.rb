class ApiApplicationController < ActionController::Base
	protect_from_forgery with: :null_session

	private 

  def authenticate_user_from_token!
    user_id = params[:auth_user_id].presence
    user = User.find_by(authentication_token: params[:auth_token])
    if user && user_id
      @current_user = user
    else
      permission_denied
    end
  end

  def permission_denied
    render status: :401, json: {error: "Unauthorized!"}
  end

end