class ContactUsController < ApiApplicationController
	before_filter :authenticate_user_from_token!
	before_filter :set_contact_us, only: [:update, :destroy]
	respond_to :json

	def index
		@contact_us = @current_user.contact_us
		if @contact_us
			render status: 200, json: {success: true, data: @contact_us.as_json}
		else
			render status: 404, json: {success: false, error: "Could not fetch contact_us!"}
		end
	end

	def create
		@contact_us = @current_user.contact_us.build contact_us_params
		if @contact_us.save!
			render status: 201, json: {success: true}
		else
			render status: 200, json: {success: false, error: @contact_us.errors}
		end
	end

	def update
		if @contact_us and @contact_us.update_attributes! contact_us_params
			render status: 201, json: {success: true}
		else
			render status: 200, json: {success: false, error: @contact_us.errors}
		end
	end

	def destroy
		if @contact_us and @contact_us.destroy!
			render status: 201, json: {success: true}
		else
			render status: 200, json: {success: false}
		end
	end

	private
	def contact_us_params
		params.require(:data).permit(:issue, :description)
	end

	def set_contact_us
		@contact_us = ContactUs.find params[:data][:id]
	end
end