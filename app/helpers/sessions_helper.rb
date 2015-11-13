module SessionsHelper
	def s3_access_token
     	render status: 200, 
     	json: {
        	policy:    s3_upload_policy,
        	signature: s3_upload_signature,
        	key:       ENV["ACCESS_KEY_ID"]
      	}
    end

    protected
	def s3_upload_policy
		@policy ||= create_s3_upload_policy
	end

	def create_s3_upload_policy
		Base64.encode64(
	  	{
	    	"expiration" => 1.hour.from_now.utc.xmlschema,
	    	"conditions" => [
	      	{ "bucket" =>  ENV["BUCKET_NAME"] },
	      	[ "starts-with", "$key", "" ],
	      	{ "acl" => "public-read" },
	      	[ "starts-with", "$Content-Type", "" ],
	      	[ "content-length-range", 0, 40 * 1024 * 1024 ]
	    ]
	  	}.to_json).gsub(/\n/,'')
	end

	def s3_upload_signature
		Base64.encode64(OpenSSL::HMAC.digest(OpenSSL::Digest.new('sha1'), ENV["SECRET_ACCESS_KEY"], s3_upload_policy)).gsub("\n","")
	end
end