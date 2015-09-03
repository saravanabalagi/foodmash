class Api::V1::CartsController < ApiApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_cart
	prepend_before_filter :authenticate_user_from_token!
	before_filter :set_cart, only: [:remove_from_cart, :destroy]
	before_filter :set_or_create_cart, only: [:index, :add_to_cart]
	respond_to :json

	def index
		if @cart 
			@cart.total = @cart.total_price
			@cart.save! if @cart.total
			render status: 200, json: {success: true, data: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name]}}, :category => {only: [:id, :name, :description]}], only: [:id, :quantity]} } ,:product => {only: [:name, :price, :description]}], only: [:id, :quantity, :total]} }, only: [:id, :total]) }
		else
			render status: 404, json: {success: false, error: "Could not find cart!"}
		end
	end

	def add_to_cart
		if @cart and @cart.add_combo_from_mobile(params[:data])
			render status: 201, json: {success: true, data: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name]}}, :category => {only: [:id, :name, :description]}], only: [:id, :quantity]} } ,:product => {only: [:name, :price, :description]}], only: [:id, :quantity, :total]} }, only: [:id, :total]) }
		else
			render status: 200, json: {success: false, error: "Could not add to cart!"}
		end
	end

	def remove_from_cart
		if @cart and @cart.remove_combo_from_mobile(params[:data][:id])
			render status: 201, json: {success: true, data: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name]}}, :category => {only: [:id, :name, :description]}], only: [:id, :quantity]} } ,:product => {only: [:name, :price, :description]}], only: [:id, :quantity, :total]} }, only: [:id, :total]) }
		else
			render status: 200, json: {success: false, error: "Could not remove from cart!"}
		end
	end

	def destroy
		if @cart and @cart.orders.destroy_all
			render status: 201, json: {success: true,  message: "Cart was cleared of all orders!"}
		else
			render status: 200, json: {success: false, error: "Could not clear the cart!"}
		end
	end

	private 
	def invalid_cart
		render status: 200, json: {success: false, error: "Attempt to access invalid cart!"}
	end

	def set_cart
		@cart = Cart.find params[:data][:id]
	end

	def set_or_create_cart
	  if @current_user
	    @cart = @current_user.carts.where(aasm_state: 'not_started').first.presence || Cart.create(user_id: @current_user.id)
	  end
	end
end