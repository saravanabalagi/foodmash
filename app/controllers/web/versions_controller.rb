class Web::VersionsController < ApplicationController
	respond_to :json
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	before_filter :get_version, only: [:update, :destroy]
	load_and_authorize_resource skip_load_resource

	def index
		@versions = Version.where(params.permit(:id, :version_name, :version_code))
		if @versions 
			render status: 200, json: @versions.as_json
		else
			render status: 404, json: {error: 'Versions were not found!'}
		end
	end

	def create
		@version = Version.new version_params
		if @version.save! 
			render status: 201, json: @version.as_json
		else
			render status: 422, json: @version.errors.as_json
		end
	end

	def update
		if @version && @version.update_attributes(version_update_params)
			render status: 200, json: @version.as_json
		else
			render status: 422, json: @version.errors.as_json
		end
	end

	def destroy
		if @version && @version.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Version with id #{params[:id]} not found!"}
		end
	end


	private
	def get_version
		@version = Version.find params[:id]
	end

	def version_params
		params.require(:version).permit(:version_name, :changelog, :force, :version_code)
	end

	def version_update_params
		params.require(:version).permit(:version_name, :changelog, :force, :version_code)
	end
end