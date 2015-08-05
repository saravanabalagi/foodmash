class RestaurantsController < ApplicationController
	respond_to :json
	before_action :get_restaurant, only: [:show, :update, :destroy, :has_combos]

	def index
		@restaurants = Restaurant.where(params.permit(:id))
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

	def has_combos
		if @restaurant
			@combos = @restaurant.has_combos
			if @combos
				render status: 200, json: @combos.as_json(:include => {:combo_options => {:include => :combo_option_dishes}})
			else
				render status: 404, json: {error: "Could not find the combos!"}
			end
		else	
			render status: 404, json: {error: "Could not find the restaurant!"}
		end
	end

	private
	def get_restaurant
		@restaurant = Restaurant.find params[:id]
	end

	def restaurant_params
		params.require(:restaurant).permit(:name, :address, :branch, :picture_url, :latitude, :longitude, :description)
	end

	def restaurant_update_params
		params.require(:restaurant).permit(:name, :address, :branch, :picture_url, :latitude, :longitude, :description)
	end

end
