class Api::V1::VersionsController < ApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	respond_to :json

	def index
		@versions = Version.last
		if @versions 
			render status: 200, json: {success: true, data: @versions.as_json(only: [:name, :id, :changelog, :force])}
		else
			render status: 404, json: {success: false, error: 'Versions were not found!'}
		end
	end
end