class Web::AreasController < ApplicationController
	respond_to :json
	before_filter :get_area, only: [:update, :destroy]
	load_and_authorize_resource skip_load_resource

	def index
		@areas = Area.where(params.permit(:id, :name, :city_id, :packaging_centre_id))
		if @areas 
			render status: 200, json: @areas.as_json(:include => :packaging_centre)
		else
			render status: 404, json: {error: 'Areas were not found!'}
		end
	end

	def create
		@area = Area.new area_params
		if @area.save! 
			render status: 201, json: @area.as_json(:include => :packaging_centre)
		else
			render status: 422, json: @area.errors.as_json
		end
	end

	def update
		if @area && @area.update_attributes(area_update_params)
			render status: 200, json: @area.as_json(:include => :packaging_centre)
		else
			render status: 422, json: @area.errors.as_json
		end
	end

	def destroy
		if @area && @area.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Area with id #{params[:id]} not found!"}
		end
	end


	private
	def get_area
		@area = Area.find params[:id]
	end

	def area_params
		params.require(:area).permit(:name, :city_id, :packaging_centre_id)
	end

	def area_update_params
		params.require(:area).permit(:name, :city_id, :packaging_centre_id)
	end
end