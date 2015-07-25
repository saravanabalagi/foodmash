class Api::V1::DishesController < ApiApplicationController
	respond_to :json

	def index
		dishes = Dish.all
		if dishes
			render status: 200, json: dishes
		else
			render status: 404, json: "Could not find all the dishes!"
		end
	end

	def show
		dish = Dish.find params[:id]
		if dish
			render status: 200, json: dish
		else
			render status: 404, json: {error: "Could not find dish with id #{params[:id]}!"}
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
end