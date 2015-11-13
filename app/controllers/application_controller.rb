class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery
  after_filter :set_csrf_cookie_for_ng
  before_filter :allow_iframe_requests

  rescue_from CanCan::AccessDenied do |exception|
    forbidden_request
  end
  
  def allow_iframe_requests
    response.headers.delete('X-Frame-Options')
  end

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  private 

  def authenticate_user_from_token!
    user_token = params[:auth_user_token].presence
    user = user_token && User.find_by(user_token: user_token)
    session = user.sessions.where(session_token: params[:auth_token]).first
    permission_denied unless session
    if user and user_token
      @current_user = user
    else
      permission_denied
    end
  end

  def forbidden_request
    render status: 403, json: {error: "Not allowed to make that request!"}    
  end

  def permission_denied
    render status: 401, json: {error: "Permission denied!"}
  end

  protected
    def verified_request?
      super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
    end
end
