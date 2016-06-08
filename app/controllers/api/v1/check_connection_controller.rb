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
			title: 'Rains Galore',
			message: 'Operations halted due to rain, please come back tomorrow!',
			image: 'https://s3-ap-southeast-1.amazonaws.com/foodmash-india/assets/blame_it_on_rain.png',
			blocking: false
		}
		settings = {
			 mash_cash: false,
			 online_payments: false,
			 verify_user: true
		}
		if params[:android_id].present?
			render status: 200, json: {success: true, data: {versions: versions, settings: settings}}
		else
			render status: 404, json: {success: false}
		end 
	end

end