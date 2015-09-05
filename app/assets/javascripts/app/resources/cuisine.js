'use strict';

angular.module('foodmashApp.resources')

.factory('Cuisine', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/cuisines', 
		name: 'cuisine'
	});

	return resource;
}]);