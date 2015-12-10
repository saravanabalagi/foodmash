'use strict';

angular.module('foodmashApp.resources')

.factory('Areas', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/areas', 
		name: 'area'
	});

	return resource;
}]);