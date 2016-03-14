class Web::PaymentsController < ApplicationController
 	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
 	prepend_before_filter :authenticate_user_from_token!, except: [:success, :failure]
 	before_filter :set_current_cart, only: [:purchase_for_cod]
 	before_filter :set_payu_processed_cart, only: [:success, :failure]
 	respond_to :json

 	def get_hash
		checksum = Payment.calculate_hash(params[:payment][:setup_details]) || nil
		if checksum.present?
			render status: 200, json: {hash: checksum, key: ENV['key'], salt: ENV['salt']}
		else
			render status: 422, json: {error: 'Could not calculate hash!'}
		end
 	end

 	def success
 		if params.present? and @cart.add_fields_from_payu(params) and @cart.purchase!
			render status: 200, json: {message: 'Cart was successfully processed!'}
		else
			render status: 422, json: {error: 'Cart was not successfully processed!'}
		end
 	end

 	def failure
 		if params.present? and @cart.add_fields_from_payu(params)
			render status: 200, json: {message: 'Cart payment failed to process!'}
		else
			render status: 422, json: {error: 'Cart payment failure was not processed!'}
		end
 	end

 	def purchase_for_cod
 		if @cart.add_items_to_cart(params[:payment][:cart]) and @cart.set_payment_method('COD') and @cart.purchase!
 			render status: 200, json: {message: 'Succesfully ordered!'}
 		else
 			render status: 422, json: {error: 'Failed to order!'}
 		end
 	end

 	private
 	def set_current_cart
		@cart = @current_user.carts.where(aasm_state: 'not_started').first.presence 		
 	end

 	def set_payu_processed_cart
 		@cart = Cart.where(order_id: params[:txnid]).first.presence
 	end
 end