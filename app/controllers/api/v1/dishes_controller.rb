class Api::V1::DishesController < ApiApplicationController
	respond_to :json

	def index
		dishes = Dish.where(params.permit(:id, :name))
		if dishes
			render status: 200, json: dishes.as_json(:include => [:restaurant, :dish_type])
		else
			render status: 404, json: "Could not find all the dishes!"
		end
	end

	def belongs_to_combos
		dish = Dish.find params[:id]
		if dish
			render status: 200, json: dish.belongs_to_combos.as_json
		else
			render status: 404, json: {error: "Could not find the combos!"}
		end
	end
end