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
			title: 'Welcome to Foodmash!',
			message: 'We deliver from 7-10 p.m.',
			image: 'https://s3-ap-southeast-1.amazonaws.com/foodmash-india/assets/welcome.jpg',
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