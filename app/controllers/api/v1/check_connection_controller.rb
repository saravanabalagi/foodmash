class Api::V1::CheckConnectionController < ApiApplicationController
	respond_to :json

	def ping
		if params[:android_id].present?
			render status: 200, json: {success: true}
		else
			render status: 404, json: {success: false}
		end 
	end

	def instantiate
		versions = Version.last
		maintenance = {
			title: 'Foodmash Launch',
			message: 'We are working on something big for you, come back today evening at 7 p.m. !',
			image: '',
			blocking: true
		}
		settings = {

		}
		if params[:android_id].present?
			render status: 200, json: {success: true, data: {versions: versions, maintainence: maintainence, settings: settings}}
		else
			render status: 404, json: {success: false}
		end 
	end

end