class Version < ActiveRecord::Base
	validates_presence_of :version_code, :version_name
end
