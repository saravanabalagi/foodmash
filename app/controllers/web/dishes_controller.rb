class Web::DishesController < ApplicationController
	respond_to :json
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	before_action :get_dish, only: [:update, :destroy, :belongs_to_combos]
	load_and_authorize_resource skip_load_resource

	def index
		@dishes = Dish.where(params.permit(:id, :restaurant_id, :name, :dish_type_id, :cuisine_id)).order("price ASC").where(arcive: false)
		if @dishes 
			render status: 200, json: @dishes.as_json(:include => [:dish_type, :cuisine])
		else
			render status: 404, json: {error: 'Dishes not found!'}
		end
	end

	def create
		@dish = Dish.new dish_params
		if @dish.save! 
			render status: 201, json: @dish.as_json(:include => [:dish_type, :cuisine])
		else
			render status: 422, json: @dish.errors.as_json
		end
	end

	def update
		if @dish && @dish.update_attributes!(dish_update_params)
			render status: 200, json: @dish.as_json(:include => [:dish_type, :cuisine])
		else
			render status: 422, json: @dish.errors.as_json
		end
	end

	def destroy
		if @dish && @dish.update_attributes!(arcive: true, available: false)
		  head :ok
		else
		  render status: 404, json: {error: "Dish with id #{params[:id]} not found!"}
		end
	end

	def belongs_to_combos
		if @dish
			render status: 200, json: @dish.belongs_to_combos.as_json
		else
			render status: 404, json: {error: "Could not find the combos!"}
		end
	end


	private
	def get_dish
		@dish = Dish.find params[:id]
	end

	def dish_params
		params.require(:dish).permit(:name, :price, :dish_type_id, :restaurant_id, :picture, :available, :description, :cuisine_id, :label)
	end

	def dish_update_params
		params.require(:dish).permit(:name, :price, :dish_type_id, :restaurant_id,:picture, :available, :description, :cuisine_id, :label)
	end
end
