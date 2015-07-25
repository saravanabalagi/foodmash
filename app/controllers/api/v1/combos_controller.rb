class Api::V1::CombosController < ApiApplicationController
	respond_to :json

	def index
		combos = Combo.all
		render status: 200, json: combos.as_json
	end

	def show
		combo = Combo.find params[:id]
		render status: 200, json: combo.as_json
	end
end