class Api::V1::UsersController < ApiApplicationController
  respond_to :json

  def index
    users = User.all
    if users
      render status: 200, json: users.as_json
    else
      render status: 404, json: "Could not find all the users!"
    end
  end

  def show
    user = User.find params[:id]
    if user
      render status: 200, json: user.as_json
    else
      render status: 404, json: "Could not find user!"
    end
  end

end