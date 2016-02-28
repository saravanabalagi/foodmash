class Api::V1::CartsController < ApiApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_cart
	prepend_before_filter :authenticate_user_from_token!
	before_filter :set_or_create_cart, only: [:index, :add_cart, :destroy, :purchase, :show]
	respond_to :json

	def history
		@carts = @current_user.carts.where("aasm_state != ?", 'not_started') if @current_user
		if @carts
			render status: 200, json: {success: true, data: @carts.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name]}}, :category => {only: [:id, :name, :description]}], only: [:id, :quantity]} } ,:product => {only: [:name, :price, :description]}], only: [:id, :quantity, :total]} }, only: [:id, :total, :payment_method, :order_id, :aasm_state, :updated_at]) }
		else
			render status: 404, json: {success: false, error: "Could not fetch carts history!"}
		end
	end

	def show 
		if @cart
			render status: 200, json: {success: true, data: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name]}}, :category => {only: [:id, :name, :description]}], only: [:id, :quantity]} } ,:product => {only: [:name, :price, :description, :label]}], only: [:id, :quantity, :total]} }, only: [:id, :total, :payment_method, :order_id, :aasm_state, :updated_at]) }
		else
			render status: 404, json: {success: false, error: "Could not fetch order!"}
		end
	end

	def purchase
		return invalid_data unless params[:data][:payment_method]
		if @cart and @cart.update_attributes! payment_method: params[:data][:payment_method] and @cart.purchase!
			render status: 200, json: {success: true, data: {order_id: @cart.order_id}}
		else
			render status: 404, json: {success: false, error: "Could not fetch cart!"}
		end
	end

	def index
		if @cart and @cart.save!
			render status: 200, json: {success: true, data: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name]}}, :category => {only: [:id, :name, :description]}], only: [:id, :quantity]} } ,:product => {only: [:name, :price, :description]}], only: [:id, :quantity, :total]} }, only: [:id, :total]) }
		else
			render status: 404, json: {success: false, error: "Could not find cart!"}
		end
	end

	def add_cart
		if @cart and @cart.add_cart(params[:data][:cart], params[:data][:delivery_address_id], params[:data][:vat], params[:data][:grand_total], params[:data][:delivery_charge])
			render status: 201, json: {success: true, data: @cart.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {only: [:id, :name]}}, :category => {only: [:id, :name, :description]}], only: [:id, :quantity]} } ,:product => {only: [:name, :price, :description]}], only: [:id, :quantity, :total]} }, only: [:id, :grand_total]) }
		else
			render status: 200, json: {success: false, error: "Could not add to cart!"}
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

	def set_or_create_cart
		if @current_user
			@cart = @current_user.carts.where(aasm_state: 'not_started').first.presence || Cart.create(user_id: @current_user.id)
	   end
	end
end