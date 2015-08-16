'use strict';

angular.module('foodmashApp.resources')

.factory('Dish', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){

	var resource = railsResourceFactory({
		url: '/web/dishes',
		name: 'dish'
	});

	return resource;
}]);