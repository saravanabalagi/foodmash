class Api::V1::CombosController < ApiApplicationController
	respond_to :json

	def index
		combos = Combo.where(params.permit(:id))
		if combos
			render status: 200, json: combos.as_json(:include => {:combo_options => {:include => :combo_option_dishes}})
		else
			render status: 404, json: {error: "Could not load the combos!"}
		end
	end

end