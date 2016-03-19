class Web::ComboOptionDishesController < ApplicationController
	respond_to :json
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	before_action :get_combo_option_dish, only: [:update, :destroy]
	load_and_authorize_resource skip_load_resource

	def index
		@combo_option_dishes = ComboOptionDish.where(params.permit(:combo_option_id, :dish_id))
		if @combo_option_dishes 
			render status: 200, json: @combo_option_dishes.as_json(:include => [{:dish => {:include => :restaurant}}, :combo_option])
		else
			render status: 404, json: {error: 'Combos Option Dishes not found!'}
		end
	end

	def create
		@combo_option_dish = ComboOptionDish.new combo_option_dish_params
		if @combo_option_dish.save! 
			render status: 201, json: @combo_option_dish.as_json(:include => [{:dish => {:include => :restaurant}}, :combo_option])
		else
			render status: 422, json: @combo_option_dish.errors.as_json
		end
	end

	def update
		if @combo_option_dish && @combo_option_dish.update_attributes(combo_option_dish_update_params)
			render status: 200, json: @combo_option_dish.as_json(:include => [{:dish => {:include => :restaurant}}, :combo_option])
		else
			render status: 422, json: @combo_option_dish.errors.as_json
		end
	end

	def destroy
		if @combo_option_dish && @combo_option_dish.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Combo Option Dish with id #{params[:id]} not found!"}
		end
	end


	private
	def get_combo_option_dish
		@combo_option_dish = ComboOptionDish.find params[:id]
	end

	def combo_option_dish_params
		params.require(:combo_option_dish).permit(:combo_option_id, :dish_id)
	end

	def combo_option_dish_update_params
		params.require(:combo_option_dish).permit(:combo_option_id, :dish_id)
	end
end
