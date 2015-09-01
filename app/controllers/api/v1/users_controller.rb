class Api::V1::UsersController < ApiApplicationController
  respond_to :json

  def index
    users = User.where(params.permit(:id, :email, :mobile_no))
    if users
      render status: 200, json: {success: true, data: users.as_json(except: [:authentication_token, :mobile_authentication_token, :user_token])}
    else
      render status: 404, json: {success: false, "Could not find all the users!"}
    end
  end

end