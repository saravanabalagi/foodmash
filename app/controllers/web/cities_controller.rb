class Web::CitiesController < ApplicationController
	respond_to :json
	before_filter :get_city, only: [:update, :destroy]
	load_and_authorize_resource skip_load_resource except: [:set_city]

	def index
		@cities = City.where(params.permit(:id, :name))
		if @cities 
			render status: 200, json: @cities.as_json(:include => {:areas => {:include => :packaging_centre}})
		else
			render status: 404, json: {error: 'Cities were not found!'}
		end
	end

	def set_city
		@cities = City.where(params.permit(:id, :name))
		if @cities 
			render status: 200, json: @cities.as_json(:include => :areas)
		else
			render status: 404, json: {error: 'Cities were not found!'}
		end
	end

	def create
		@city = City.new city_params
		if @city.save! 
			render status: 201, json: @city.as_json(:include => {:areas => {:include => :packaging_centre}})
		else
			render status: 422, json: @city.errors.as_json
		end
	end

	def update
		if @city && @city.update_attributes(city_update_params)
			render status: 200, json: @city.as_json(:include => {:areas => {:include => :packaging_centre}})
		else
			render status: 422, json: @city.errors.as_json
		end
	end

	def destroy
		if @city && @city.destroy
		  head :ok
		else
		  render status: 404, json: {error: "City with id #{params[:id]} not found!"}
		end
	end


	private
	def get_city
		@city = City.find params[:id]
	end

	def city_params
		params.require(:city).permit(:name)
	end

	def city_update_params
		params.require(:city).permit(:name)
	end
end