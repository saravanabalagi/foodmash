class Api::V1::UsersController < ApiApplicationController
  respond_to :json

  def index
    users = User.all
    render status: 200, json: users.as_json
  end

  def show
    user = User.find params[:id]
    render status: 200, json: user.as_json
  end

end