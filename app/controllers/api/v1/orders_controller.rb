class Api::V1::OrdersController < ApiApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	prepend_before_filter :authenticate_user_from_token!
	before_filter :set_order, only: [:update, :destroy]
	respond_to :json

	def update
		if @order and @order.update_attributes! update_order_params
			@cart = @order.cart
			render status: 201, json: {success: true, data: {total: @cart.total, order: {quantity: @order.quantity, total: @order.total} } }
		else
			render status: 200, json: {success: false, error: "Could not update the order!"}
		end
	end

	def destroy
		@cart = @order.cart
		if @order and @order.destroy! and @cart.update_total
			render status: 201, json: {success: true, data: {total: @cart.total}}
		else
			render status: 200, json: {success: false}
		end
	end

	private
	def set_order
		@order = Order.find params[:data][:order][:id]
	end

	def update_order_params
		params.require(:data).permit(:id, :quantity)
	end
end