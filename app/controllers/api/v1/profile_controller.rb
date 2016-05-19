class Api::V1::ProfileController < ApiApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	before_filter :authenticate_user_from_token!
  respond_to :json

  def show
    if @current_user
      render status: 200, json: {success: true, data: {user: @current_user.as_json(:include => {:roles => {:include => :resource}}) } }
    else
      render status: 404, json: {success: false, error: "Could not find the user!"}
    end
  end

  def send_otp
    if @current_user.set_otp
      SendOtpJob.set(wait: 5.seconds).perform_later(@current_user)
      MakeOtpNilJob.set(wait: 5.minutes).perform_later(@current_user)
      render status: 201, json: {success: true, data: { user: @current_user.as_json(:include => [{:roles => {:include => :resource}}], except: [:otp]) }}
    else
      render status: 200, json: {error: "Was not able to send otp!"}
    end
  end

  def verify_otp
    if @current_user.otp == params[:data][:otp] and ((Time.now - @current_user.otp_set) < 5.minutes) and @current_user.update_attributes(verified: true)
      @current_user.reset_otp
      render status: 201, json: {success: true, data: {user: @current_user.as_json(:include => {:roles => {:include => :resource}}) }}
    else
      render status: 200, json: {success: false, error: 'Account was not verified!'}
    end
  end

  def update
    if @current_user and @current_user.update_attributes profile_update_params
      render status: 201, json: {success: true, data: {user: @current_user.as_json(:include => {:roles => {:include => :resource}}) }}
    else
      render status: 200, json: {success: false, error: "Could not update profile!"}
    end
  end

  private
  def profile_update_params
    params[:data].require(:user).permit(:name, :dob, :mobile_no, :offers, :email)
  end
end