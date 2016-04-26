class Api::V1::PaymentsController < ApiApplicationController
 	respond_to :json
 	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
 	before_filter :authenticate_user_from_token!, except: [:success, :failure]
	before_filter :set_current_cart
	before_filter :apply_promo_or_mash_cash, only: [:purchase_by_cod, :success]

 	def index 
 		render status: 200
 	end
 	 
	def get_hash
		details = {
			firstname: @current_user.name.split.first,
			productinfo: 'a bunch of combos from Foodmash',
			surl: 'http://www.foodmash.in/api/v1/payments/success',
			furl: 'http://www.foodmash.in/api/v1/payments/failure',
			amount: @cart.grand_total.to_s,
			txnid: @cart.generate_order_id,
			email: @current_user.email,
			phone: @current_user.mobile_no,
			udf1: '',
			udf2: '',
			udf3: '',
			udf4: '',
			udf5: '',
		}
		checksum = Payment.calculate_hash(details) || nil
		if checksum.present?
			render status: 200, json: {success: true, data: {hash: checksum, order_id: @cart.order_id}}
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
 		if params.present? and @success and @cart.add_fields_from_payu(params) and @current_user.award_mash_cash(check_for_promo_and_set(@cart)) and @cart.purchase!
			render 'mobile_success'
		else
			render 'mobile_success'
		end
 	end

 	def failure
 		if params.present? and @cart.add_fields_from_payu(params)
			render 'mobile_failure'
		else
			render 'mobile_failure'
		end	
 	end

 	def apply_promo_code
 		success, promo_discount, grand_total = @cart.apply_promo_code(params[:data][:promo_code].downcase)
 	 	if success and promo_discount
 	 		render status: 200, json: {success: success, data: {promo_discount: promo_discount, grand_total: grand_total}}
 	 	else
 			render status: 200, json: {success: success, error: 'Pomo code was invalid!'}
 	 	end
 	end

 	def apply_mash_cash
 		success, mash_cash, grand_total = @cart.apply_mash_cash(params[:data][:mash_cash].to_f)
 		if success and mash_cash and mash_cash > 0.0
 			render status: 200, json: {success: success, data: {mash_cash: mash_cash, grand_total: grand_total}}
 		else
 			render status: 200, json: {success: success, error: 'Mash Cash could not be applied!'}
 		end
 	end

	def purchase_by_cod
		return invalid_data unless params[:data][:payment_method]
		if @success and @cart.set_payment_method('COD') and @current_user.award_mash_cash(check_for_promo_and_set(@cart)) and @cart.purchase!
			render status: 200, json: {success: true, data: {order_id: @cart.order_id, promo_discount: @cart.promo_discount}}
		elsif @cart.set_payment_method('COD') and @cart.purchase! 
			render status: 200, json: {success: true, data: {order_id: @cart.order_id}}
		else
			render status: 200, json: {success: false, error: 'Password was incorrect!'}
		end
	end

	private
	def set_current_cart
		@cart = @current_user.carts.where(aasm_state: 'not_started').first.presence
	end

	def check_for_promo_and_set(cart)
 		if (cart.promo_discount.present? and cart.promo_id.present?) or cart.mash_cash.present?
 			return 0.0
 		else
 			return cart.delivery_charge
 		end
 	end

 	def apply_promo_or_mash_cash
 		@success = nil
 		if params[:data][:promo_code].present?
 			@success, promo_discount, grand_total = @cart.apply_promo_code(params[:data][:promo_code].downcase)
 		end
 		if params[:data][:mash_cash].present?
 			@success, mash_cash, grand_total = @cart.apply_mash_cash(params[:data][:mash_cash].to_f)
 		end
 		if @success and promo_discount
 			promo = Promo.find_by(code: params[:data][:promo_code].downcase)
 			promo.users << @current_user
 			@cart.promo_id = promo.id
 			@cart.promo_discount = params[:data][:promo_discount].to_f if params[:data][:promo_discount]
 		elsif @success and mash_cash
 			@cart.mash_cash = params[:data][:mash_cash].to_f if params[:data][:mash_cash] 
 		end
 	end
 end