class RegistrationsController < Devise::RegistrationsController
	before_filter :authenticate_user_from_token!, only: [:update, :destroy]
	respond_to :json

	def new 
		super
	end

	  def create
	  	# Create the user
		  build_resource(sign_up_params)
		  # Try to save them
		  if resource.save!
		  	SendSignupConfirmationJob.set(wait: 20.seconds).perform_later(resource)
		  	session_token = resource.generate_session_token
	      	resource.sessions.create! session_token: session_token
	      	resource.award_mash_cash(20)
		    render status: 200,
		    json: {
		      success: true, info: "Registered", data: {
		        user: resource.as_json(:include => [{:roles => {:include => :resource}}], except: [:otp]),
		        auth_token: session_token
		      }
		    }
		  else
		    # Otherwise fail
		    render status: :unprocessable_entity,
		    json: {
		      success: false,
		      info: resource.errors
		    }
		  end 
	    
	  end

	 def update
		if @current_user and @current_user.update_attributes update_params
	  	render status: 200, json: @current_user.as_json
		else
	  	render status: 422, json: {error: user.errors}
		end
	 end

	def forgot_password
	 	user = User.find_by(email: params[:user][:email]) || User.find_by(mobile_no: params[:user][:mobile_no])
	 	if user and user.set_otp
	     SendOtpJob.set(wait: 5.seconds).perform_later(user)
	     MakeOtpNilJob.set(wait: 5.minutes).perform_later(user)
	 		render status: 201, json: {otp: user.otp}
	 	else
	 		render status: 422, json: {success: false, error: "Could not reset password!"}
	 	end
	end

	def check_otp
	 	user = User.find_by(otp: params[:otp])
	 	if user and ((Time.now - user.otp_set) < 5.minutes) and user.generate_otp_token(user.otp)
	 		render status: 200, json: {otp_token: user.reset_password_token}
	 	else
	 		render status: 422, json: {error: "Invalid password reset token!"}
	 	end
	end

	def reset_password_from_token
	   return invalid_data unless params[:user][:otp_token]
	 	user = User.find_by(reset_password_token: params[:user][:otp_token])
	 	user.password = params[:user][:password]
	 	user.password_confirmation = params[:user][:password_confirmation]
	   #destroy previous sessions with the same android_id
	   user.sessions.where(user_id: user.id).destroy_all
	   #generate a new session for the same android_id
	   session_token = user.generate_session_token
	   user.sessions.create! session_token: session_token
	   #reset the tokens to nil
	   user.reset_password_token = nil
	   self.otp = nil
	   self.otp_set = nil
	 	if user and user.save!
	 		render status: 201, json: {user_token: user.user_token, session_token: session_token}
	 	else
	 		render status: 422, json: {error: "Password was not reset!"}
	 	end
	end

	def destroy
		if @current_user
			@current_user.delete
			head status: 200
		else
			render status: 422, json: {error: "Unable to cancel registration!"}
		end
	end

private 
	def sign_up_params
		params.require(:user).permit(:name, :email, :password, :password_confirmation, :mobile_no, :invitation_token)
	end

	def update_params
		params.require(:user).permit(:name, :email, :mobile_no)
	end

	def account_update_params
		params.require(:user)
	end
end