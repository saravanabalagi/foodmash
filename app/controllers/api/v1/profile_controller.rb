class Api::V1::ProfileController < ApiApplicationController
	before_filter :authenticate_user_from_token!, only: :show
  respond_to :json

  def show
    if params[:auth_user_token] and params[:auth_session_token]
    	@user = User.find_by params[:auth_user_token] || User.find_by(mobile_authentication_token: params[:auth_session_token])
      render status: 200, json: @user.as_json(except: [:authentication_token, :mobile_authentication_token])
    else
      render status: 404, json: "Could not find the user!"
    end
  end

end