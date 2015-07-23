class Api::v1::CombosController < ApiApplicationController
	respond_to :json

	def index
		combos = Combo.all
		respond_with status: 200, combos.as_json
	end

	def show
		combo = Combo.find params[:id]
		respond_with status: 200, combo.as_json
	end
end