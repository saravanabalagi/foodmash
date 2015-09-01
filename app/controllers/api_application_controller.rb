class ApiApplicationController < ActionController::Base
  require 'openssl'
  require 'base64'
  
	private 

  def check_for_android_id!
    android_id = params[:android_id]
    session[:android_id] = params[:android_id] if params[:android_id]
    return android_denied unless android_id
  end

  def authenticate_user_from_token!
    android_token = params[:auth_android_token]
    user_token = params[:auth_user_token].presence
    user = User.find_by(user_token: params[:auth_user_token])
    if user and user_token and android_token and session[:auth_session_token] == params[:auth_session_token]
      @current_user = user
    else
      permission_denied
    end
  end

  def permission_denied
    render status: 401, json: {success: false, error: "Unauthorized!"}
  end

  def android_denied
    render status: 401, json: {success: false, error: "Android Id is invalid or absent!"}
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