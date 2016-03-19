class Api::V1::CitiesController < ApiApplicationController
	respond_to :json

	def index
		@cities = City.where(params.fetch(:data, {}).permit(:id, :name))
		if @cities 
			render status: 200, json:{success: true, data: @cities.as_json(:include => {:areas => {only: [:id, :packaging_centre_id, :name]}}, only: [:id, :name])}
		else
			render status: 404, json: {success: false, error: 'Cities were not found!'}
		end
	end
end