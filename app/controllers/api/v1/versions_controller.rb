class Api::V1::VersionsController < ApplicationController
	respond_to :json

	def index
		@versions = Version.where(params.require(:data).permit(:id, :name)).last
		if @versions 
			render status: 200, json: {success: true, data: @versions.as_json(only: [:name, :id, :changelog, :force])}
		else
			render status: 404, json: {success: false, error: 'Versions were not found!'}
		end
	end
end