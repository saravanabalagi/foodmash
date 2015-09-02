class Web::CartsController < ApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_cart
	prepend_before_filter :authenticate_user_from_token!
	before_filter :set_cart, only: :destroy
	before_filter :set_or_create_cart, only: [:create, :add_to_cart, :index]
	respond_to :json

	def index
		if @cart 
			@cart.total = @cart.total_price
			@cart.save! if @cart.total
			render status: 200, json: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [:item, :category]} } ,:product]  } })
		else
			render status: 422, json: {error: "Could not find cart!"}
		end
	end

	def create
		if @cart
			render status: 201, json: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [:item, :category]} } ,:product]  } })
		else
			render status: 422, json: {error: @cart.errors.as_json}
		end
	end

	def add_to_cart
		if @cart and @cart.add_combo(params[:cart][:combo_id], params[:cart][:selected_dishes])
			render status: 200, json: {message: "successfully added to cart!"}
		else
			render status: 422, json: {error: "Could not add to cart!"}
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
	  end
	end
end