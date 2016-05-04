class Web::PromosController < ApplicationController
	respond_to :json
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	before_filter :get_promo, only: [:update, :destroy]
	load_and_authorize_resource skip_load_resource

	def index
		@promos = Promo.where(params.permit(:id, :code))
		if @promos 
			render status: 200, json: @promos.as_json
		else
			render status: 404, json: {error: 'Promos were not found!'}
		end
	end

	def create
		@promo = Promo.new promo_params
		if @promo.save! 
			render status: 201, json: @promo.as_json
		else
			render status: 422, json: @promo.errors.as_json
		end
	end

	def update
		if @promo && @promo.update_attributes(promo_update_params)
			render status: 200, json: @promo.as_json
		else
			render status: 422, json: @promo.errors.as_json
		end
	end

	def destroy
		if @promo && @promo.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Promo with id #{params[:id]} not found!"}
		end
	end

	private
	def get_promo
		@promo = Promo.find params[:id]
	end

	def promo_params
		params.require(:promo).permit(:code, :active, :discount_percentage)
	end

	def promo_update_params
		params.require(:promo).permit(:code, :active, :discount_percentage)
	end
end