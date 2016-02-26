class Web::CartsController < ApplicationController
	respond_to :json
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_cart
	prepend_before_filter :authenticate_user_from_token!
	before_filter :set_cart, only: :destroy
	before_filter :set_or_create_cart, only: [:show, :change_status, :purchase]

	def index
		@carts = Cart.where(params.permit(:user_id, :id, :aasm_state)).where.not(aasm_state: 'not_started')
		if @carts
			render status: 200, json: @carts.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name, :price]}}], only: [:id, :quantity, :category_id, :category_type]} } ,:product => {only: [:id, :name, :price]}], only: [:id, :quantity, :total, :updated_at]} }, only: [:id, :total, :payment_method, :order_id, :aasm_state, :updated_at, :grand_total, :vat])
		else
			render status: 422, json: {error: "Could not fetch carts!"}
		end
	end

	def show
		if @cart
			render status: 200, json: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name, :price]}}], only: [:id, :quantity, :category_id, :category_type]} } ,:product => {only: [:id, :name, :price]}], only: [:id, :quantity, :total, :updated_at]} }, only: [:id, :total, :payment_method, :order_id, :aasm_state, :updated_at])
		else
			render status: 200, json: {error: "Could not fetch cart!"}
		end
	end

	def purchase
		# return invalid_data unless params[:cart][:cart][:payment_method]
		if @cart and @cart.add_items_to_cart(params[:cart][:cart]) and @cart.purchase!
			render status: 200, json: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name, :price]}}], only: [:id, :quantity, :category_id, :category_type]} } ,:product => {only: [:id, :name, :price]}], only: [:id, :quantity, :total, :updated_at]} }, only: [:id, :total, :payment_method, :order_id, :aasm_state, :updated_at])
		else
			render status: 404, json: {success: false, error: "Could not fetch cart!"}
		end
	end

	def change_status
		if @cart and @cart.change_status(params[:cart][:cart][:status])
			render status: 201, json: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name, :price]}}], only: [:id, :quantity, :category_id, :category_type]} } ,:product => {only: [:id, :name, :price]}], only: [:id, :quantity, :total, :updated_at]} }, only: [:id, :total, :payment_method, :order_id, :aasm_state, :updated_at])
		else
			render status: 422, json: {error: "Could change status of cart!"}
		end
	end

	def destroy
		if @cart and @cart.orders.destroy_all
			render status: 200, json: {message: "Cart was cleared of all orders!"}
		else
			render status: 422, json: {error: "Could not clear the cart!"}
		end
	end

	private
	def invalid_cart
		render status: 422, json: {error: "Attempt to access invalid cart!"}
	end

	def set_cart
		@cart = Cart.find params[:id]
	end

	def set_or_create_cart
		session = @current_user.sessions.where(session_token: params[:auth_token]).first
		return permission_denied unless session
	  if @current_user 
	    @cart = @current_user.carts.where(aasm_state: 'not_started').first.presence || Cart.create(user_id: @current_user.id)
	    @cart.generate_order_id if !@cart.order_id.present?
	  end
	end
end