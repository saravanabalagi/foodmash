class Web::AwsController < ApplicationController
	include SessionsHelper
	respond_to :json

	def index
		s3_access_token
	end
end
