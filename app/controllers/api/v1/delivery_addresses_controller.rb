class Api::V1::DeliveryAddressesController < ApiApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	before_filter :authenticate_user_from_token!
	before_filter :set_delivery_address, only: [:update, :destroy]
	respond_to :json

	def index
		@delivery_addresses = @current_user.delivery_addresses.where(params.require(:data).permit(:area_id))
		if @delivery_addresses
			render status: 200, json: {success: true, data: @delivery_addresses.as_json(only: [:id, :line1, :line2, :contact_no, :area_id, :latitude, :longitude, :primary, :name])}
		else
			render status: 404, json: {success: false, error: "Could not find user's previous addresses!"}
		end
	end

	def create 
		@delivery_address = @current_user.delivery_addresses.build delivery_address_params
		if @delivery_address.save!
			render status: 201, json: {success: true, data: @delivery_addresses.as_json(only: [:id, :line1, :line2, :contact_no, :area_id, :latitude, :longitude, :primary, :name])}
		else
			render status: 200, json: {success: false, error: @delivery_address.errors}
		end
	end

	def update
		if @delivery_address and @delivery_address.update_attributes! delivery_address_update_params
			render status: 201, json: {success: true, data: @delivery_addresses.as_json(only: [:id, :line1, :line2, :contact_no, :area_id, :latitude, :longitude, :primary, :name])}
		else
			render status: 200, json: {success: false, error: "Could not update delivery address!"}
		end
	end

	def destroy
		if @delivery_address and @delivery_address.destroy!
			render status: 201, json: {success: true}
		else
			render status: 200, json: {success: false, error: "Delivery address could not be found!"}
		end
	end

	private
	def set_delivery_address
		@delivery_address = DeliveryAddress.find params[:data][:id]
	end

	def delivery_address_params
		params.require(:data).permit(:name, :line1, :line2, :area_id, :contact_no, :user_id, :latitude, :longitude)
	end

	def delivery_address_update_params
		params.require(:data).permit(:name, :line1, :line2, :area_id, :contact_no, :user_id, :latitude, :longitude)
	end
end