class Api::V1::CombosController < ApiApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	prepend_before_filter :authenticate_user_from_token!
	before_filter :set_or_create_cart
	respond_to :json

	def index
		@combos = Combo.where(params.permit(:id)).where(active: true)
		if @combos
			render status: 200, json: {success: true, 
			data: 
			{
				combos: @combos.as_json(:include => [{:combo_options => {:include => {:combo_option_dishes => {:include => {:dish => {:include => [{:restaurant => {only: [:id, :name]}}, {:cuisine => {only: :name}}], only: [:id, :name, :description, :label]} } , only: :id} }, only: [:id, :name, :description, :priority]} }, {:combo_dishes => {:include => {:dish => {:include => {:restaurant => {only: [:id, :name]}}, only: [:id, :name, :description] } }, only: [:id, :priority] } } ], only: [:name, :price, :id, :no_of_purchases, :description, :group_size, :available]), 
				cart: @cart.as_json(:include => {:orders => {:include => {:product => {only: :id}}, only: [:id, :quantity, :total]} }, only: [:id, :total]) } 
			}
		else
			render status: 404, json: {success: false, error: "Could not load the combos!"}
		end
	end

	private 

	def set_or_create_cart
	  if @current_user
	    @cart = @current_user.carts.where(aasm_state: 'not_started').first.presence || Cart.create(user_id: @current_user.id)
	  end
	end
end