'use strict';

angular.module('foodmashApp.resources')

.factory('Restaurant', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/restaurants',
		name: 'restaurant'
	});

	return resource;
}])