class Web::DeliveryAddressesController < ApplicationController
	respond_to :json
	before_action :get_delivery_address, only: [:update, :destroy]
	load_and_authorize_resource skip_load_resource

	def index
		@delivery_addresses = DeliveryAddress.where(params.permit(:user_id, :area_id))
		if @delivery_addresses 
			render status: 200, json: @delivery_addresses.as_json(:include => {:area => {:include => :city}})
		else
			render status: 404, json: {error: 'Delivery Addresses not found!'}
		end
	end

	def create
		@delivery_address = @current_user.delivery_addresses.build delivery_address_params if @current_user
		if @delivery_address.save! 
			render status: 201, json: @delivery_address.as_json(:include => {:area => {:include => :city}})
		else
			render status: 422, json: @delivery_address.errors.as_json
		end
	end

	def update
		if @delivery_address && @delivery_address.update_attributes(delivery_address_update_params)
			render status: 200, json: @delivery_address.as_json(:include => {:area => {:include => :city}})
		else
			render status: 422, json: @delivery_address.errors.as_json
		end
	end

	def destroy
		if @delivery_address && @delivery_address.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Delivery Address was not deleted!"}
		end
	end

	private
	def get_delivery_address
		@delivery_address = DeliveryAddress.find params[:id]
	end

	def delivery_address_params
		params.require(:delivery_address).permit(:name, :line1, :line2, :area_id, :contact_no, :primary)
	end

	def delivery_address_update_params
		params.require(:delivery_address).permit(:name, :line1, :line2, :area_id, :contact_no, :primary)
	end
end