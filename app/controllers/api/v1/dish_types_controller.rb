class Api::V1::DishTypesController < ApiApplicationController
 respond_to :json

 def index
 	dish_types = DishType.where(params.permit(:id, :name))
 	if dish_types
 		render status: 200, json: {success: true, data: dish_types.as_json}
 	else
 		render status: 404, json: {success: false, error: "Could not load dish types!"}
 	end
 end

end