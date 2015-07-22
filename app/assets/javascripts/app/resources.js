'use strict';

angular.module('foodmashApp.resources', [])

.factory('User', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/users',
		name: 'user'
	});

	return resource;
}]);

