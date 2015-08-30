class Api::V1::DishTypesController < ApiApplicationController
 respond_to :json

 def index
 	dish_types = DishType.where(params.permit(:id, :name))
 	if dish_types.present?
 		render status: 200, json: dish_types.as_json
 	else
 		render status: 404, json: {error: "Could not load dish types!"}
 	end
 end

end