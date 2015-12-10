'use strict';

angular.module('foodmashApp.resources')

.factory('PackagingCentre', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/packaging_centres', 
		name: 'packaging_centre'
	});

	return resource;
}]);