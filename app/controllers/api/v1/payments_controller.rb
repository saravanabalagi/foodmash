class Api::V1::PaymentsController < ApiApplicationController
 	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
 	before_filter :authenticate_user_from_token!
	before_filter :set_current_cart
 	respond_to :json

 	def index 
 		render status: 200
 	end
 	 
	def get_hash
		details = {
			firstname: @current_user.name.split.first,
			productinfo: 'a bunch of combos from Foodmash',
			surl: 'http://www.foodmash.herokuapp.com/payments/success',
			furl: 'http://www.foodmash.herokuapp.com/payments/failure',
			amount: @cart.grand_total,
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

	def success
 		if params.present? and @cart.add_fields_from_payu(params)
			render status: 200, json: {message: 'Cart was successfully processed!'}
		else
			render status: 422, json: {error: 'Cart was not successfully paid for!'}
		end
 	end

 	def failure
 		if params.present? and @cart.add_fields_from_payu(params)
			render status: 200, json: {message: 'Cart payment failed to process!'}
		else
			render status: 422, json: {error: 'Cart payment failure was not processed!'}
		end
 	end

	def purchase_by_cod
		return invalid_data unless params[:data][:payment_method]
		if current_user.valid_password? params[:data][:password] and @cart.purchase! and @cart.set_payment_method('COD')
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