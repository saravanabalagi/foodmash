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
			title: 'Folks at Work',
			message: 'Foodmash is under maintenance, please come back later :)',
			image: 'http://vigilidelfuoco.usb.it/uploads/pics/men-at-work_02.jpg',
			blocking: false
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