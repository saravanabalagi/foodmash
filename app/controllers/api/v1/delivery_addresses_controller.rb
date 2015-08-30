class Api::V1::DeliveryAddressesController < ApiApplicationController
	before_filter :authenticate_user_from_token!
	before_filter :set_delivery_address, only: [:update, :destroy]
	respond_to :json

	def index
		@delivery_addresses = @current_user.delivery_addresses
		if @delivery_addresses.present?
			render status: 200, json: @delivery_addresses.as_json
		else
			render status: 404, json: {error: "Could not find user's previous addresses!"}
		end
	end

	def create 
		@delivery_address = parse_and_set(DeliveryAddress.new, params[:data])
		if @delivery_address.save!
			render status: 200, json: @delivery_address.as_json
		else
			render status: 422, json: {error: @delivery_address.errors}
		end
	end

	def update
		@delivery_address = parse_and_set(@delivery_address, params[:data])
		if @delivery_address and @delivery_address.save!
			render status: 200, json: @delivery_address.as_json
		else
			render status: 422, json: {error: "Could not update delivery address!"}
		end
	end

	def destroy
		if @delivery_address and @delivery_address.destroy!
			head :ok
		else
			render status: 404, json: {error: "Delivery address could not be found!"}
		end
	end

	private
	def set_delivery_address
		@delivery_address = DeliveryAddress.find params[:id]
	end

	def delivery_address_update_params
		params.require(:data).permit(:name, )
	end

	def parse_and_set(delivery_address, data)
		delivery_address.user_id = @current_user.id
		delivery_address.name = data[:name]
		delivery_address.line1 = data[:address][:line1]
		delivery_address.line2 = data[:address][:line2]
		delivery_address.area = data[:address][:area]
		delivery_address.city = data[:address][:city]
		delivery_address.pincode = data[:address][:pincode]
		delivery_address.latitude = data[:geolocation][:latitude]
		delivery_address.longitude = data[:geolocation][:longitude]
		delivery_address.contact_no = data[:phone]
		delivery_address.primary = data[:primary]
		return delivery_address
	end
end