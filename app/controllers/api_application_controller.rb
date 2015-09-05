class ApiApplicationController < ActionController::Base
  require 'openssl'
  require 'base64'
  
	private 
  def check_for_android_id!
    android_id = params[:android_id]
    return android_denied unless android_id
  end

  def authenticate_user_from_token!
    android_token = params[:auth_android_token]
    return android_token_denied unless android_token
    user_token = params[:auth_user_token].presence
    return user_token_denied unless user_token
    user = User.find_by(user_token: params[:auth_user_token])
    return user_denied unless user
    session = user.sessions.where(session_token: params[:auth_session_token]).first
    permission_denied unless session
    if user and user_token and android_token
      @current_user = user
    else
      permission_denied
    end
  end

  def permission_denied
    render status: 401, json: {success: false, error: "Unauthorized!"}
  end

  def user_token_denied
    render status: 401, json: {success: false, error: "User Token is invalid or absent!"}
  end

  def user_denied
    render status: 401, json: {success: false, error: "User not found!"}
  end

   def android_token_denied
    render status: 401, json: {success: false, error: "Android Token is invalid or absent!"}
  end

  def android_denied
    render status: 401, json: {success: false, error: "Android Id is invalid or absent!"}
  end

  def invalid_data
    render status: 200, json: {success: false, error: "Invalid or expired data!"}
  end

  def check_android_token
    if android_token
      aes = OpenSSL::Cipher::AES128.new(:CBC)
      aes.decrypt
      aes.key = session[:android_id]
      aes.iv = params[:auth_session_token]
      decrypted_key = aes.update(Base64::decode64(params[:android_token])) + aes.final
      return decrypted_key == session[:android_id] ? true : false
    else
      return false
    end
  end
end