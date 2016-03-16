class Api::V1::RestaurantsController < ApiApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	respond_to :json
	
	def index
		restaurants = Restaurant.where(params.fetch(:data, {}).permit(:id, :name))
		if restaurants
			render status: 200, json: {success: true, data: restaurants.as_json(:include => :dishes)}
		else
			render status: 404, json: {success: false, error: "Could not find all the restaurants!"}
		end
	end

	def has_combos
		restaurant = Restaurant.find params.fetch(:data, {}).permit(:id)
		if restaurant
			render status: 200, json: {success: true, data: restaurant.has_combos}
		else
			render status: 404, json: {success: false, error: "Could not find the combos!"}
		end
	end
end