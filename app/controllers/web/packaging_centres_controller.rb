class Web::PackagingCentresController < ApplicationController
	respond_to :json
	before_filter :get_packaging_centre, only: [:update, :destroy]
	load_and_authorize_resource skip_load_resource

	def index
		@packaging_centres = PackagingCentre.where(params.permit(:id, :name))
		if @packaging_centres 
			render status: 200, json: @packaging_centres.as_json
		else
			render status: 404, json: {error: 'Packaging Centres were not found!'}
		end
	end

	def create
		@packaging_centre = PackagingCentre.new packaging_centre_params
		if @packaging_centre.save! 
			render status: 201, json: @packaging_centre.as_json
		else
			render status: 422, json: @packaging_centre.errors.as_json
		end
	end

	def update
		if @packaging_centre && @packaging_centre.update_attributes(packaging_centre_params)
			render status: 200, json: @packaging_centre.as_json
		else
			render status: 422, json: @packaging_centre.errors.as_json
		end
	end

	def destroy
		if @packaging_centre && @packaging_centre.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Packaging Centre with id #{params[:id]} not found!"}
		end
	end


	private
	def get_packaging_centre
		@packaging_centre = PackagingCentre.find params[:id]
	end

	def packaging_centre_params
		params.require(:packaging_centre).permit(:name)
	end

	def packaging_centre_update_params
		params.require(:packaging_centre).permit(:name)
	end
end