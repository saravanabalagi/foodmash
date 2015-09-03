class Api::V1::DeliveryAddressesController < ApiApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	before_filter :authenticate_user_from_token!
	before_filter :set_delivery_address, only: [:update, :destroy]
	respond_to :json

	def index
		@delivery_addresses = @current_user.delivery_addresses
		if @delivery_addresses
			render status: 200, json: {success: true, data: jsonify_object(@delivery_addresses).as_json}
		else
			render status: 404, json: {success: false, error: "Could not find user's previous addresses!"}
		end
	end

	def create 
		@delivery_address = parse_and_set(DeliveryAddress.new, params[:data])
		if @delivery_address.save!
			render status: 201, json: {success: true}
		else
			render status: 200, json: {success: false, error: @delivery_address.errors}
		end
	end

	def update
		@delivery_address = parse_and_set(@delivery_address, params[:data])
		if @delivery_address and @delivery_address.save!
			render status: 201, json: {success: true}
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

	def delivery_address_update_params
		params.require(:data)
	end

	def jsonify_object(delivery_address)
		if delivery_address.kind_of? DeliveryAddress::ActiveRecord_Associations_CollectionProxy
			delivery_addresses_json = delivery_address.map do |d|
				{ id: d.id, name: d.name, 
					address: {line1: d.line1, line2: d.line2, area: d.area, city: d.city, pincode: d.pincode}, 
					geolocation: {latitude: d.latitude, longitude: d.longitude}, 
					phone: d.contact_no, primary: d.primary }
			end
			return delivery_addresses_json
		else
			delivery_address_json = 
				{ id: delivery_address.id, name: delivery_address.name, 
					address: {line1: delivery_address.line1, line2: delivery_address.line2, area: delivery_address.area, 
					city: delivery_address.city, pincode: delivery_address.pincode}, 
					geolocation: {latitude: delivery_address.latitude, longitude: delivery_address.longitude}, 
					phone: delivery_address.contact_no, primary: delivery_address.primary }
			return delivery_address_json
		end
	end

	def parse_and_set(delivery_address, data)
		delivery_address.user_id = @current_user.id; delivery_address.name = data[:name]; delivery_address.contact_no = data[:phone]; 
	  delivery_address.line1 = data[:address][:line1]; delivery_address.line2 = data[:address][:line2]; 
	  delivery_address.pincode = data[:address][:pincode].to_i; delivery_address.area = data[:address][:area]; 
	  delivery_address.city = data[:address][:city]; 
	  delivery_address.latitude = data[:geolocation][:latitude]; delivery_address.longitude = data[:geolocation][:longitude]; 
		delivery_address.primary = data[:primary]; 
		return delivery_address
	end
end