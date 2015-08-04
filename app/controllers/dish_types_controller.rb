class DishTypesController < ApplicationController
	respond_to :json
	before_filter :get_dish_type, only: [:show, :update, :destroy]

	def index
		@dish_types = DishType.where(params.permit(:id, :name))
		if @dish_types 
			render status: 200, json: @dish_types.as_json
		else
			render status: 404, json: {error: 'Dishe Types were not found!'}
		end
		end

	def create
		@dish_type = DishType.new dish_type_params
		if @dish_type.save 
			render status: 201, json: @dish_type.as_json
		else
			render status: 422, json: @dish_type.errors.as_json
		end
	end

	def show
		if @dish_type
			render status: 200, json: @dish_type.as_json
		else
			render status: 404, json: {error: "Dish Type with id #{params[:id]} was not found!"}
		end
	end

	def update
		if @dish_type && @dish_type.update_attributes(dish_type_update_params)
			render status: 200, json: @dish_type.as_json
		else
			render status: 422, json: @dish_type.errors.as_json
		end
	end

	def destroy
		if @dish_type && @dish_type.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Dish Type with id #{params[:id]} not found!"}
		end
	end


	private
	def get_dish_type
		@dish_type = DishType.find params[:id]
	end

	def dish_type_params
		params.require(:dish_type).permit(:name)
	end

	def dish_type_update_params
		params.require(:dish_type).permit(:name)
	end
end
