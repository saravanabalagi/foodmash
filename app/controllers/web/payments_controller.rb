class Web::PaymentsController < ApplicationController
 	respond_to :json
 	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
 	before_filter :set_current_cart
 	before_filter :authenticate_user_from_token!

 	def index
 	end

 	def get_hash
 		params[:payment][:setup_details][:txnid] = @cart.generate_order_id
		checksum = Payment.calculate_hash(params[:payment][:setup_details]) || nil
		if checksum.present?
			render status: 200, json: {hash: checksum.as_json}
		else
			render status: 200, json: {error: 'Could not calculate hash!'}
		end
 	end

 	def check_password_for_cod
 		
 	end

 	private
 	def set_current_cart
		@cart = current_user.carts.where(aasm_state: 'not_started').first.presence 		
 	end
 end