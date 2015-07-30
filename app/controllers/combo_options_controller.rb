class CombosController < ApplicationController
	respond_to :json
	before_action :get_combo_option, only: [:show, :update, :destroy]

	def index
		@combo_options = ComboOption.where(params.permit(:combo_id, :dish_type_id))
		if @combo_options 
			render status: 200, json: @combo_options.as_json
		else
			render status: 404, json: {error: 'Combos not found!'}
		end
	end

	def create
		@combo_option = ComboOption.new combo_params
		if @combo_option.save 
			render status: 201, json: @combo_option.as_json
		else
			render status: 422, json: @combo_option.errors.as_json
		end
	end

	def show
		if @combo_option
			render status: 200, json: @combo_option.as_json
		else
			render status: 404, json: {error: "Combo Option with id #{params[:id]} was not found!"}
		end
	end

	def update
		if @combo_option && @combo_option.update_attributes(combo_option_update_params)
			render status: 200, json: @combo_option.as_json
		else
			render status: 422, json: @combo_option.errors.as_json
		end
	end

	def destroy
		if @combo_option && @combo_option.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Combo with id #{params[:id]} not found!"}
		end
	end


	private
	def get_combo_option
		@combo_option = ComboOption.find params[:id]
	end

	def combo_option_params
		params.require(:combo_option).permit(:name, :combo_id, :dish_type_id, :description)
	end

	def combo_option_update_params
		params.require(:combo_option).permit(:name, :combo_id, :dish_type_id, :description)
	end
end
