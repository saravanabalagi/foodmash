class Api::V1::ProfileController < ApiApplicationController
	before_filter :authenticate_user_from_token!
  respond_to :json

  def show
    if @current_user
      render status: 200, json: {success: true, user: @current_user.as_json(only: [:name, :dob, :mobile_no, :offers])}
    else
      render status: 404, json: {success: false, error: "Could not find the user!"}
    end
  end

  def update
    if @current_user and @current_user.update_attributes! profile_update_params
      render status: 201, json: {success: true}
    else
      render status: 422, json: {success: false, error: "Could not update profile!"}
    end
  end

  private
  def profile_update_params
    params.require(:user).permit(:name, :dob, :mobile_no, :offers)
  end
end