class Web::PaymentsController < ApplicationController
 	respond_to :json
 	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
 	prepend_before_filter :authenticate_user_from_token!
 	before_filter :set_or_create_cart, only: [:purchase_for_cod, :get_hash]
 	before_filter :set_payu_processed_cart, only: [:success, :failure]

 	def get_hash
 		details = {
			firstname: @current_user.name.split.first,
			productinfo: 'a bunch of combos from Foodmash',
			surl: 'http://localhost:3000/payments/success',
			furl: 'http://localhost:3000/payments/failure',
			txnid: @cart.generate_order_id,
			email: @current_user.email,
			phone: @current_user.mobile_no,
			udf1: '',
			udf2: '',
			udf3: '',
			udf4: '',
			udf5: '',
			key: ENV['key'],
			salt: ENV['salt'],
			amount: params[:payment][:setup_details][:amount]
		}
		details['hash'] = Payment.calculate_hash(details) || nil
		if details.hash.present?
			render status: 200, json: {setup_details: details}
		else
			render status: 422, json: {error: 'Could not calculate hash!'}
		end
 	end

 	def success
 		byebug
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

 	def validate_promo_code
 		success, promo_discount, cart = Cart.apply_promo_code(params[:payment][:promo_code].downcase, params[:payment][:cart], params[:payment][:promo])
 	 	if success and promo_discount
 	 		render status: 200, json: {promo_discount: promo_discount, cart: cart}
 	 	else
 			render status: 422, json: {error: 'Pomo code was invalid!'}
 	 	end
 	end

 	def purchase_for_cod
 		if @cart.add_items_to_cart(params[:payment][:cart]) and @cart.set_payment_method('COD') and @cart.purchase!
 			render status: 200, json: {message: 'Succesfully ordered!'}
 		else
 			render status: 422, json: {error: 'Password was incorrect!'}
 		end
 	end

 	private
 	def set_or_create_cart
 		session = @current_user.sessions.where(session_token: params[:auth_token]).first
 		return permission_denied unless session
 	  if @current_user 
 	    @cart = @current_user.carts.where(aasm_state: 'not_started').first.presence || Cart.create(user_id: @current_user.id)
 	    @cart.generate_order_id if !@cart.order_id.present?
 	  end
 	end

 	def set_payu_processed_cart
 		@cart = Cart.where(order_id: params[:txnid]).first.presence
 	end
 end