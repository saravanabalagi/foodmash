class Api::V1::ProfileController < ApiApplicationController
	authenticate_user_from_token! only: :show
  respond_to :json

  def show
    if params[:auth_user_id] and params[:mobile_auth_token]
    	@user = User.find params[:auth_user_id] || User.find_by(mobile_authentication_token: params[:mobile_auth_token])
      render status: 200, json: @user.as_json(except: [:authentication_token, :mobile_authentication_token])
    else
      render status: 404, json: "Could not find the user!"
    end
  end

end