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
			title: 'Foodmash Offer',
			message: 'We run from 1 - 3 p.m. and 7 - 10 p.m. Use promo code FM15 to get 15% off on all orders!',
			image: 'https://coretium.files.wordpress.com/2012/11/15off.png',
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