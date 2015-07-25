class ApiApplicationController < ActionController::Base
	# protect_from_forgery
 #  after_filter :set_csrf_cookie_for_api
  
 #  def set_csrf_cookie_for_api
 #    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
 #  end

	private 

  def authenticate_user_from_token!
    user_id = params[:auth_user_id].presence
    user = User.find_by(authentication_token: params[:auth_token])
    if user && user_id
      @current_user = user
    else
      permission_denied
    end
  end

  def permission_denied
    render status: 401, json: {error: "Unauthorized!"}
  end

 # protected
 #  def verified_request?
 #    super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
 #  end

end