class Web::CuisinesController < ApplicationController
	respond_to :json
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	before_filter :get_cuisine, only: [:update, :destroy]
	load_and_authorize_resource skip_load_resource

	def index
		@cuisines = Cuisine.where(params.permit(:id, :name))
		if @cuisines 
			render status: 200, json: @cuisines.as_json
		else
			render status: 404, json: {error: 'Cuisines were not found!'}
		end
	end

	def create
		@cuisine = Cuisine.new cuisine_params
		if @cuisine.save! 
			render status: 201, json: @cuisine.as_json
		else
			render status: 422, json: @cuisine.errors.as_json
		end
	end

	def update
		if @cuisine && @cuisine.update_attributes(cuisine_update_params)
			render status: 200, json: @cuisine.as_json
		else
			render status: 422, json: @cuisine.errors.as_json
		end
	end

	def destroy
		if @cuisine && @cuisine.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Cuisine with id #{params[:id]} not found!"}
		end
	end


	private
	def get_cuisine
		@cuisine = Cuisine.find params[:id]
	end

	def cuisine_params
		params.require(:cuisine).permit(:name)
	end

	def cuisine_update_params
		params.require(:cuisine).permit(:name)
	end
end
