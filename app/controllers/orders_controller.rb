class OrdersController < ApplicationController
	before_filter :set_order, only: [:show, :edit, :update, :destroy]
	before_filter :set_cart
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

	def set_cart
		@cart = Cart.find_by user_id: @current_user.id
	end

	def line_item_params
	 params.require(:order).permit(:product_id, :product_type) 
	end

end