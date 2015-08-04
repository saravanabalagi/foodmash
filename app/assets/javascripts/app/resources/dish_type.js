'use strict';

angular.module('foodmashApp.resources')

.factory('DishType', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/dish_types', 
		name: 'dish_type'
	});

	return resource;
}]);