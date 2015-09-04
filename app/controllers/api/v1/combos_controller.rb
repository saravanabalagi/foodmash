class Api::V1::CombosController < ApiApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	respond_to :json

	def index
		combos = Combo.where(params.permit(:id))
		if combos
			render status: 200, json: {success: true, data: combos.as_json(:include => [{:combo_options => {:include => {:combo_option_dishes => {:include => {:dish => {:include => {:restaurant => {only: [:id, :name]}}, only: [:id, :name]} } , only: :id} }, only: [:id, :name, :description]} }, {:combo_dishes => {only: [:id, :dish_id]}}], only: [:name, :price, :id, :no_of_purchases, :description]) }
		else
			render status: 404, json: {success: false, error: "Could not load the combos!"}
		end
	end

end