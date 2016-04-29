class Api::V1::CombosController < ApiApplicationController
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	prepend_before_filter :set_user
	before_filter :set_or_create_cart
	respond_to :json

	def index
		@combos = Combo.where(params.fetch(:data, {}).permit(:id, :packaging_centre_id)).where(active: true).order('price ASC')
		if @combos and @user
			render status: 200, json: {success: true, 
			data: 
			{
				combos: @combos.as_json(:include => [{:combo_options => {:include => {:combo_option_dishes => {:include => {:dish => {:include => [{:restaurant => {only: [:id, :name, :logo]}}], only: [:id, :name, :description, :label, :price, :picture]} } , only: :id} }, only: [:id, :name, :description, :priority, :min_count]} }, {:combo_dishes => {:include => {:dish => {:include => {:restaurant => {only: [:id, :name, :logo]}}, only: [:id, :name, :description, :label, :price, :picture] } }, only: [:id, :priority, :min_count] } } ], only: [:name, :id, :no_of_purchases, :description, :group_size, :available, :label, :price, :picture, :category, :customizable]), 
				cart: @cart.as_json(:include => {:orders => {:include => {:product => {only: :id}}, only: [:id, :quantity, :total]} }, only: [:id, :total]),
				user: @user.as_json(:include => {:roles => {:include => :resource}}) }
			}
		elsif !@user and @combos
			render status: 200, json: {success: true, 
			data: 
			{
				combos: @combos.as_json(:include => [{:combo_options => {:include => {:combo_option_dishes => {:include => {:dish => {:include => [{:restaurant => {only: [:id, :name, :logo]}}], only: [:id, :name, :description, :label, :price, :picture]} } , only: :id} }, only: [:id, :name, :description, :priority, :min_count]} }, {:combo_dishes => {:include => {:dish => {:include => {:restaurant => {only: [:id, :name, :logo]}}, only: [:id, :name, :description, :label, :price, :picture] } }, only: [:id, :priority, :min_count] } } ], only: [:name, :id, :no_of_purchases, :description, :group_size, :available, :label, :price, :picture, :category, :customizable]), 
				cart: @cart.as_json(:include => {:orders => {:include => {:product => {only: :id}}, only: [:id, :quantity, :total]} }, only: [:id, :total]) }
			}
		else
			render status: 404, json: {success: false, error: "Could not load the combos!"}
		end
	end

	private 

	def set_user
		@user = User.find_by(user_token: params[:auth_user_token]) if params[:auth_user_token]
	end

	def set_or_create_cart
	  if @user
	    @cart = @user.carts.where(aasm_state: 'not_started').first.presence || Cart.create(user_id: @user.id)
	  end
	end
end