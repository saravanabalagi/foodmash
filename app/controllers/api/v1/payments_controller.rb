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
			productinfo: 'a bunch of combos from foodmash',
			surl: 'www.foodmash.in/payments/success',
			furl: 'www.foodmash.in/payments/failure',
			amount: @cart.total,
			txnid: @cart.generate_order_id,
			email: @current_user.email,
			phone: @current_user.mobile_no,
			udf1: '',
			udf2: '',
			udf3: '',
			udf4: '',
			udf5: '',
			service_provider: 'payu_paisa'
		}
		checksum = Payment.calculate_hash(details) || nil
		if checksum.present?
			render status: 200, json: {success: true, data: {hash: checksum}}
		else
			render status: 200, json: {success:true, error: 'Was not able to calculate hash!'}
		end
	end

	private
	def set_current_cart
		@cart = @current_user.carts.where(aasm_state: 'not_started').first.presence
	end
 end