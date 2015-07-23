class RestaurantsController < ApplicationController
	respond_to :json
	before_action :get_restaurant, only: [:show, :update, :destroy]

	def index
		@restaurants = Restaurant.all
		if @restaurants 
			render status: 200, json: @restaurants.as_json
		else
			render status: 404, json: {error: 'Restaurants not found!'}
		end
	end

	def create
		@restaurant = Restaurant.new restaurant_params
		if @restaurant.save 
			render status: 201, json: @restaurant.as_json
		else
			render status: 422, json: @restaurant.errors.as_json
		end
	end

	def show
		if @restaurant
			render status: 200, json: @restaurant.as_json
		else
			render status: 404, json: {error: "Restaurant with id #{params[:id]} was not found!"}
		end
	end

	def update
		if @restaurant && @restaurant.update_attributes(restaurant_update_params)
			render status: 200, json: @restaurant.as_json
		else
			render status: 422, json: @restaurant.errors.as_json
		end
	end

	def destroy
		if @restaurant && @restaurant.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Restaurant with id #{params[:id]} not found!"}
		end
	end

	private
	def get_restaurant
		@restaurant = Restaurant.find params[:id]
	end

	def restaurant_params
		params.require(:restaurant).permit(:name, :address, :branch, :picture_url, :latitude, :longitude)
	end

	def restaurant_update_params
		params.require(:restaurant).permit(:name, :address, :branch, :picture_url, :latitude, :longitude)
	end

end
