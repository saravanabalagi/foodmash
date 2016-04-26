class Web::InvitationsController < ApplicationController
	respond_to :json
	rescue_from ActiveRecord::RecordNotFound, with: :invalid_data
	before_filter :get_invitation, only: [:update, :destroy]
	load_and_authorize_resource skip_load_resource

	def index
		@invitations = Invitation.where(params.permit(:id))
		if @invitations 
			render status: 200, json: @invitations.as_json(:include => {:areas => {:include => :packaging_centre}})
		else
			render status: 404, json: {error: 'Invitations were not found!'}
		end
	end

	def create
		@invitation = Invitation.new invitation_params
		@invitation.sender = @current_user
		if @invitation.save! 
			render status: 201, json: @invitation.as_json(:include => {:areas => {:include => :packaging_centre}})
		else
			render status: 422, json: @invitation.errors.as_json
		end
	end

	def update
		if @invitation && @invitation.update_attributes(invitation_update_params)
			render status: 200, json: @invitation.as_json(:include => {:areas => {:include => :packaging_centre}})
		else
			render status: 422, json: @invitation.errors.as_json
		end
	end

	def destroy
		if @invitation && @invitation.destroy
		  head :ok
		else
		  render status: 404, json: {error: "Invitation with id #{params[:id]} not found!"}
		end
	end


	private
	def get_invitation
		@invitation = Invitation.find params[:id]
	end

	def invitation_params
		params.require(:invitation).permit(:sender_id, :recipient_email)
	end

	def invitation_update_params
		params.require(:invitation).permit(:sender_id, :recipient_email)
	end
end
