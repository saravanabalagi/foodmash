class Api::V1::RestaurantsController < ApiApplicationController
	respond_to :json
	
	def index
		restaurants = Restaurant.all
		if restaurants
			render status: 200, json: restaurants.as_json(:include => :dishes)
		else
			render status: 404, json: {error: "Could not find all the restaurants!"}
		end
	end

	def show
		restaurant = Restaurant.find params[:id]
		if restaurant
			render status: 200, json: restaurant.as_json(:include => :dishes)
		else
			render status: 404, json: {error: "Could not find restaurant with id #{params[:id]}!"}
		end
	end

	def has_combos
		restaurant = Restaurant.find params[:id]
		if restaurant
			render status: 200, json: restaurant.has_combos
		else
			render status: 404, json: {error: "Could not find the combos!"}
		end
	end
end