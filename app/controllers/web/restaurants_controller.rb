class Web::RestaurantsController < ApplicationController
	respond_to :json
	before_action :get_restaurant, only: [:update, :destroy, :has_combos, :get_carts_for_restaurant]
	load_and_authorize_resource skip_load_resource except: [:has_combos, :has_dish_type, :get_carts_for_restaurant]

	def index
		@restaurants = Restaurant.where(params.permit(:id))
		if @restaurants 
			render status: 200, json: @restaurants.as_json(:include => [{:dishes => {:include => [:cuisine, :dish_type]}}, :area])
		else
			render status: 404, json: {error: 'Restaurants not found!'}
		end
	end

	def load_from_packaging_centre
		@restaurants = Restaurant.where(params.permit(:id))
		if @restaurants 
			render status: 200, json: @restaurants.as_json(:include => [{:dishes => {:include => [:cuisine, :dish_type]}}, :area])
		else
			render status: 404, json: {error: 'Restaurants not found!'}
		end
	end

	def create
		@restaurant = Restaurant.new restaurant_params
		if @restaurant.save! 
			render status: 201, json: @restaurant.as_json(:include => [{:dishes => {:include => [:cuisine, :dish_type]}}, :area])
		else
			render status: 422, json: @restaurant.errors.as_json
		end
	end

	def update
		if @restaurant && @restaurant.update_attributes(restaurant_update_params)
			render status: 200, json: @restaurant.as_json(:include => [{:dishes => {:include => [:cuisine, :dish_type]}}, :area])
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

	def has_dish_type(dish_type_id)
		@restaurants = Restaurant.all.each { |r| r if r.dish_types.pluck(:id).include? dish_type_id }
		if @restaurants
			render status: 200, json: @restaurants.as_json(:include => :dishes)
		else
			render status: 404, json: {error: 'Restaurants not found!'}
		end
	end

	def get_carts_for_restaurant
		@carts = @restaurant.get_carts_for_restaurant
		if @carts
			render status: 200, json: @carts.as_json(:include => {:orders => {:include => [{:order_items => {:include => [{:item => {:include => {:restaurant => {only: [:id, :name, :area_id]}}, only: [:id, :name, :price]}}], only: [:id, :quantity, :category_id, :category_type]} } ,:product => {only: [:id, :name, :price]}], only: [:id, :quantity, :total, :updated_at]} }, only: [:id, :total, :payment_method, :order_id, :aasm_state, :updated_at])
		else
			render status: 422, json: {error: "Could not fetch carts!"}
		end
	end

	private
	def get_restaurant
		@restaurant = Restaurant.find params[:id]
	end

	def restaurant_params
		params.require(:restaurant).permit(:name, :address, :branch, :picture, :logo, :latitude, :longitude, :description, :area_id)
	end

	def restaurant_update_params
		params.require(:restaurant).permit(:name, :address, :branch, :picture, :logo, :latitude, :longitude, :description, :area_id)
	end

end
