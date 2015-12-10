'use strict';

angular.module('foodmashApp.resources')

.factory('City', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/cities', 
		name: 'city'
	});

	return resource;
}]);