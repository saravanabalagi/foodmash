class Payment < ActiveRecord::Base

	def self.calculate_hash(setup_details)
		hash = ENV['key'] +  '|' + setup_details[:txnid] +  '|' + setup_details[:amount].to_s +  '|' + setup_details[:productinfo] +  '|' + setup_details[:firstname] +  '|' + setup_details[:email] +  '|' + '|' + '|' + '|' + '|' + '|' + '|' + '|' + '|' + '|' + '|' + ENV['salt'] 
 		Digest::SHA2.new(512).hexdigest(hash)
	end
end