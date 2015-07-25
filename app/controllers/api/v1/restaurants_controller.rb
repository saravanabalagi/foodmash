class Api::V1::RestaurantsController < ApiApplicationController
	respond_to :json
	
	def index
		restaurants = Restaurant.all
		render status: 200, json: restaurants.as_json
	end

	def show
		restaurant = Restaurant.find params[:id]
		render status: 200, json: restaurant.as_json
	end
end