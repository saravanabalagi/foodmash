'use strict';

angular.module('foodmashApp.resources')

.factory('Version', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/versions', 
		name: 'version'
	});

	return resource;
}]);