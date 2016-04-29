'use strict';

angular.module('foodmashApp.resources')

.factory('Promo', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/promos', 
		name: 'promo'
	});

	return resource;
}]);