class Api::V1::UsersController < ApiApplicationController
  respond_to :json

  def index
    users = User.where(params[:data].require(:user).permit(:id, :email, :mobile_no))
    if users
      render status: 200, json: {success: true, data: users.as_json(except: :user_token)}
    else
      render status: 404, json: {success: false, error: "Could not find all the users!"}
    end
  end

end