class Web::OrdersController < ApplicationController
	before_filter :set_order, only: [:update, :destroy]
	respond_to :json

	def index
		@orders = Order.where(params.permit(:id, :cart_id))
		if @orders
			render status: 200, json: @orders.as_json
		else
			render status: 404, json: {error: "Could not fetch orders!"}
		end
	end

	def update
		if @order and @order.update_attributes! update_order_params
			render status: 200, json: @order.as_json(:include => :cart)
		else
			render status: 404, json: {error: "Could not update order!"}
		end
	end

	def destroy
		if @order and @order.destroy!
			render status: 200
		else
			render status: 404, json: {error: "Could not find order with id #{params[:id]}"}
		end
	end


	private
	def set_order
		@order = Order.find params[:id]
	end

	def set_product
		case  params[:order][:product_type]
			when 'Combo' 
				return Combo.find params[:order][:product_id]
		end
	end

	def order_params
	 params.require(:order).permit(:product_id, :product_type) 
	end

	def update_order_params
		params.require(:order).permit(:id, :quantity)
	end
end