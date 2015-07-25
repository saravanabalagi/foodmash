class DishesController < ApplicationController
	respond_to :json
	before_action :get_dish, only: [:show, :update, :destroy]

	def index
		@dishes = Dish.all
		if @dishes 
			render status: 200, json: @dishes.as_json
		else
			render status: 404, json: {error: 'Dishes not found!'}
		end
		end

	def create
		@dish = Dish.new dish_params
		if @dish.save 
			render status: 201, json: @dish.as_json
		else
			render status: 422, json: @dish.errors.as_json
		end
	end

	def show
		if @dish
			render status: 200, json: @dish.as_json
		else
			render status: 404, json: {error: "Dish with id #{params[:id]} was not found!"}
		end
	end

	def update
		if @dish && @dish.update_attributes(dish_update_params)
			render status: 200, json: @dish.as_json
		else
			render status: 422, json: @dish.errors.as_json
		end
	end

	def destroy
		if @dish && @dish.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Dish with id #{params[:id]} not found!"}
		end
	end

	def belongs_to_combos
		dish = Dish.find params[:id]
		if dish
			render status: 200, json: dish.belongs_to_combos
		else
			render status: 404, json: {error: "Could not find the combos!"}
		end
	end


	private
	def get_dish
		dish = Dish.find params[:id]
	end

	def dish_params
		params.require(:dish).permit(:name, :price, :dish_type, :restaurant_id, :no_of_purchases, :picture_url)
	end

	def dish_update_params
		params.require(:dish).permit(:name, :price, :dish_type, :restaurant_id, :picture_url)
	end
end
