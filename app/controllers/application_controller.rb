class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery
  after_filter :set_csrf_cookie_for_ng
  before_filter :allow_iframe_requests
  
  def allow_iframe_requests
    response.headers.delete('X-Frame-Options')
  end

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  private 

    def authenticate_user_from_token!
      user_id = params[:auth_user_id].presence
      user = user_id && User.find_by(user_id)
      if user && Devise.secure_compare(user.authentication_token, params[:auth_token])
        @current_user = user
      else
        permission_denied
      end
    end


    def permission_denied
      render file: "public/404.html", status: :401, layout: false
    end

  protected
    def verified_request?
      super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
    end
end
