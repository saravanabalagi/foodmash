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
		        user: resource.as_json(:include => {:roles => {:include => :resource}}),
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