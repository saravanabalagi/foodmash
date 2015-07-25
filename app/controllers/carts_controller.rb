class CartsController < ApplicationController
	before_action :set_cart, only: [:show, :edit, :update, :destroy]
	rescue_from_ActiveRecord::RecordNotFound, with: :invalid_cart
	respond_to :json

	def destroy
		if @cart.orders.destroy
			render status: 200, json: {message: "Cart was cleared of all orders!"}
		else
			render status: 422, json: {error: "Could not clear the cart!"}
		end
	end

	private
	def set_cart
		@cart = Cart.find_by(user_id: @current_user.id)
	end

	def invalid_cart
		render status: 422, json: {error: "Attempt to access invalid cart!"}
	end
end