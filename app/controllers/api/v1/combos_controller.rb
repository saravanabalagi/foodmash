class Api::V1::CombosController < ApiApplicationController
	respond_to :json

	def index
		combos = Combo.all
		if combos
			render status: 200, json: combos.as_json(:include => {:combo_options => {:include => :combo_option_dishes}})
		else
			render status: 404, json: {error: "Could not all the combos!"}
		end
	end

	def show
		combo = Combo.find params[:id]
		if combo
			render status: 200, json: combo.as_json(:include => {:combo_options => {:include => :combo_option_dishes}})
		else
			render status: 404, json: {error: "Could not find combo with id #{params[:id]}!"}
		end
	end
end