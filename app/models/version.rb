class Version < ActiveRecord::Base
	validates_presence_of :name, :changelog

end
