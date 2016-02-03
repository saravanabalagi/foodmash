class Web::CombosController < ApplicationController
	respond_to :json
	before_action :get_combo, only: [:update, :destroy]
	load_and_authorize_resource skip_load_resource except: [:load_from_packaging_centre, :get_combo_availability, :loadAWS]

	def index
		@combos = Combo.where(params.permit(:id, :name, :packaging_centre_id))
		if @combos 
			render status: 200, json: @combos.as_json(:include => :packaging_centre)
		else
			render status: 404, json: {error: 'Combos not found!'}
		end
	end

	def get_combo_availability
		@combo = Combo.find params[:combo][:id]
		if @combo
			render status: 200, json: @combo.as_json(only: [:id, :available, :active])
		else
			render status: 404, json: {error: 'Combo not found!'}
		end
	end

	def create
		@combo = Combo.new combo_params
		if @combo.save! 
			render status: 201, json: @combo.as_json(:include => :packaging_centre)
		else
			render status: 422, json: @combo.errors.as_json
		end
	end

	def update
		if @combo && @combo.update_attributes!(combo_update_params)
			render status: 200, json: @combo.as_json(:include => :packaging_centre)
		else
			render status: 422, json: @combo.errors.as_json
		end
	end

	def destroy
		if @combo && @combo.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Combo with id #{params[:id]} not found!"}
		end
	end

	def load_from_packaging_centre
		@loadedFromPackagingCentre = Combo.where(params.permit(:id, :name, :packaging_centre_id)).where(active: true)
		hash = Digest::SHA1.hexdigest(@loadedFromPackagingCentre.to_a.to_s)
		if @loadedFromPackagingCentre
			render status: 200, json: {data:
				{
					combos: @loadedFromPackagingCentre.as_json(:include => [{:combo_options => {:include => {:combo_option_dishes => {:include => {:dish => {:include => {:restaurant => {only: [:id, :name]}}, only: [:id, :name, :price, :description, :picture]} } , only: :id} }, only: [:id, :name, :description]} }, {:combo_dishes => {:include => {:dish => {:include => {:restaurant => {only: [:id, :name, :logo]}}, only: [:id, :name, :description, :price, :picture]} }, only: :id } } ], only: [:name, :price, :id, :description, :available, :active, :picture, :label, :group_size, :category]), 
					hash: hash.as_json}
				}
		else
			render status: 404, json: {error: "Could not load combos"}
		end
	end

	private
	def get_combo
		@combo = Combo.find params[:id]
	end

	def combo_params
		params.require(:combo).permit(:name, :group_size, :no_of_purchases, :description, :active, :picture, :packaging_centre_id, :category)
	end

	def combo_update_params
		params.require(:combo).permit(:name, :price, :group_size, :description, :active, :picture, :packaging_centre_id, :category)
	end
end
