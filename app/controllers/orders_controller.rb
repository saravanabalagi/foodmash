class OrdersController < ApplicationController
	before_filter :set_order, only: [:show, :destroy]
	respond_to :json

	def create
		product = set_product
		@order = @cart.add_product(product.id)
		if @order.save
			render status: 201, json: @order.as_json
		else
			render status: 422, json: {error: @order.errors}
		end
	end

	def destroy
		if @order and @order.delete
			head status: 200
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

end