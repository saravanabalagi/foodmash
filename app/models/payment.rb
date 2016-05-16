class Payment < ActiveRecord::Base

	def self.calculate_hash(setup_details)
		hash = ENV['key'] +  '|' + setup_details[:txnid] +  '|' + setup_details[:amount].to_s +  '|' + setup_details[:productinfo] +  '|' + setup_details[:firstname] +  '|' + setup_details[:email] +  '|' + '|' + '|' + '|' + '|' + '|' + '|' + '|' + '|' + '|' + '|' + ENV['salt'] 
 		Digest::SHA2.new(512).hexdigest(hash)
	end

	def self.calculate_mobile_sdk_hash
		hash = ENV['key'] + '|' + 'payment_related_details_for_mobile_sdk' + '|' + '|' + ENV['salt']
		Digest::SHA2.new(512).hexdigest(hash)
	end

	def self.calculate_hash_for_mobile_sdk(details)
		hash = ENV['key'] + '|' + details[:command] + '|' + details[:var1] + '|' + ENV['salt']
		Digest::SHA2.new(512).hexdigest(hash)
	end
end