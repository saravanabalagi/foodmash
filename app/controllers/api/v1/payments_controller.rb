class Api::V1::PaymentsController < ApiApplicationController
 	respond_to :json
 	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
 	before_filter :authenticate_user_from_token!
	before_filter :set_current_cart

 	def index 
 		render status: 200
 	end
 	 
	def get_hash
		details = {
			firstname: @current_user.name.split.first,
			productinfo: 'a bunch of combos from Foodmash',
			surl: 'http://www.foodmash.herokuapp.com/api/v1/payments/success',
			furl: 'http://www.foodmash.herokuapp.com/api/v1/payments/failure',
			amount: @cart.grand_total.to_s,
			txnid: @cart.order_id,
			email: @current_user.email,
			phone: @current_user.mobile_no,
			udf1: '',
			udf2: '',
			udf3: '',
			udf4: '',
			udf5: ''
		}
		checksum = Payment.calculate_hash(details) || nil
		if checksum.present?
			render status: 200, json: {success: true, data: {hash: checksum}}
		else
			render status: 200, json: {success:true, error: 'Was not able to calculate hash!'}
		end
	end

	def get_payment_details_for_mobile_sdk
		checksum = Payment.calculate_hash_for_mobile_sdk(params[:data])
		if checksum.present?
			render status: 200, json: {success: true, data: {hash: checksum}}
		else
			render status: 200, json: {success: false, error: 'Was not able to calculate hash'}
		end
	end

	def success
 		if params.present? and @cart.add_fields_from_payu(params) and @cart.purchase!
			render status: 200, json: {success: true, message: 'Cart was successfully processed!'}
		else
			render status: 422, json: {success: false, error: 'Cart was not successfully processed!'}
		end
 	end

 	def failure
 		if params.present? and @cart.add_fields_from_payu(params)
			render status: 200, json: {success: true, message: 'Cart payment failed to process!'}
		else
			render status: 422, json: {success: false, error: 'Cart payment failure was not processed!'}
		end
 	end

 	def validate_promo_code
 		render status: 200, json: {success: false, error: 'Pomo code was invalid!'}
 	end

	def purchase_by_cod
		return invalid_data unless params[:data][:payment_method]
		if @cart.set_payment_method('COD') and @cart.purchase! 
			render status: 200, json: {success: true, data: {order_id: @cart.order_id}}
		else
			render status: 200, json: {success: false, error: 'Password was incorrect!'}
		end
	end

	private
	def set_current_cart
		@cart = @current_user.carts.where(aasm_state: 'not_started').first.presence
	end
 end