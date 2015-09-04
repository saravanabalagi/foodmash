class Web::ComboDishesController < ApplicationController
	before_filter :get_combo_dish, only: [:update, :destroy]
	respond_to :json

	def index 
		@combo_dishes = ComboDish.where(params.permit(:id, :combo_id, :dish_type_id))
		if @combo_dishes
			render status: 200, json: @combo_dishes.as_json(:include => [:dish_type, :dish])
		else
			render status: 404, json: {error: "Could not fetch combo dishes!"}
		end
	end

	def create 
		@combo_dish = ComboDish.new combo_dish_params
		if @combo_dish.save!
			render status: 200, json: @combo_dish.as_json(:include => [:dish_type, :dish])
		else
			render status: 422, json: {error: "Could not create combo dish!"}
		end
	end

	def update
		if @combo_dish and @combo_dish.update_attributes(combo_dish_update_params)
			render status: 200, json: @combo_dish.as_json(:include => [:dish_type, :dish])
		else
			render status: 422, json: {error: "Could not update combo dish!"}
		end
	end

	def destroy
		if @combo_dish and @combo_dish.destroy!
			head :ok
		else
			render status: 404, json: {error: "Could not delete combo dish!"}
		end
	end
	
	private
	def combo_dish_params
		params.require(:combo_dish).permit(:combo_id, :dish_id, :dish_type_id)
	end

	def get_combo_dish
		@combo_dish = ComboDish.find params[:id]
	end

	def combo_dish_update_params
		params.require(:combo_dish).permit(:combo_id, :dish_id, :dish_type_id)
	end
end