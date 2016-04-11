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
			title: 'Folks at work',
			message: 'Foodmash is under maintenance :) Pls come back later.',
			image: 'http://www.protectsigns.uk/images/detailed/3/P7001_30.jpg',
			blocking: true
		}
		settings = {

		}
		if params[:android_id].present?
			render status: 200, json: {success: true, data: {versions: versions, maintenance: maintenance, settings: settings}}
		else
			render status: 404, json: {success: false}
		end 
	end

end