'use strict';

angular.module('foodmashApp.resources')

.factory('Dish', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){

	var resource = railsResourceFactory({
		url: '/dishes',
		name: 'dish'
	});

	return resource;
}]);