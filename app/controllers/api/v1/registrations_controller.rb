class Api::V1::RegistrationsController < ApiApplicationController
	before_filter :authenticate_user_from_token!, only: [:update, :destroy, :change_password]
	before_filter :check_for_android_id!, only: :create
	respond_to :json

  def create
  	# Create the user
	  resource = User.new(sign_up_params)

	  # Try to save them
	  if resource.save! 
	    render status: 200,
	    json: {
	      success: true, 
        user_token: resource.user_token,
        session_token: resource.mobile_authentication_token
	    }
	  else
	    # Otherwise fail
	    render status: 422,
	    json: {
	      success: false,
	      error: resource.errors
	    }
	  end 
    
  end

  def update
	  if @current_user and @current_user.update_attributes update_params
	    render status: 200, json: {success: true, data: @current_user.as_json(only: :user_token)}
	  else
	    render status: 422, json: {success: false, error: user.errors}
	  end
  end

  def destroy
  	if @current_user
  		@current_user.delete
  		head status: 200
  	else
  		render status: 422, json: {success: false, error: "Unable to cancel registration!"}
  	end
  end

  def check_email
  	if User.where(email: params[:email]).present?
  		render status: 200, json: {success: false}
  	else
  		render status: 200, json: {success: true}
  	end
  end

  def check_mobile_no
  	if User.where(mobile_no: params[:mobile_no]).present?
  		render status: 200, json: {success: false}
  	else
  		render status: 200, json: {success: true}
  	end
  end

  def change_password
  	if @current_user and @current_user.valid_password? params[:user][:old_password]
  		@current_user.password = params[:user][:password]
  		@current_user.password_confirmation = params[:user][:password_confirmation]
  		@current_user.save!
  		render status: 200, json: {success: true, message: "Password was successfully changed!"}
  	else
  		render status: 422, json: {success: false, error: "Could not change password!"}
  	end
  end

  def forgot_password
  	user = User.find_by(email: params[:user][:email])
  	if user and user.set_reset_password_token
  		render status: 200, json: {success: true, message: "Password reset token has been set!!"}
  	else
  		render status: 422, json: {success: false, error: "Could not reset password!"}
  	end
  end

  def check_reset_password_token
  	user = User.find_by(reset_password_token: params[:reset_password_token])
  	if user
  		render status: 200, json: {success: true, data: user.reset_password_token}
  	else
  		render status: 422, json: {success: false, error: "Invalid password reset token!"}
  	end
  end

  def reset_password_from_token
  	user = User.find_by(reset_password_token: params[:user][:reset_password_token])
  	user.password = params[:user][:password]
  	user.password_confirmation = params[:user][:password_confirmation]
  	if user and user.save! and user.clear_mobile_authentication_token
  		render status: 200, json: 
  		{
  			success: true, 
  			user_token: resource.user_token,
        session_token: resource.mobile_authentication_token
      }
  	else
  		render status: 422, json: {success: false, error: "Password was not reset!"}
  	end
  end

	private 
		def change_password_params
			params.require(:user).permit(:old_password, :password, :password_confirmation)
		end

		def sign_up_params
			params.require(:user).permit(:name, :email, :password, :password_confirmation, :mobile_no)
		end

		def update_params
			params.require(:user).permit(:name, :email, :mobile_no)
		end
end