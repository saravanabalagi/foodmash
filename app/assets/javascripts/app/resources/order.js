'use strict';

angular.module('foodmashApp.resources')

.factory('Order', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/orders',
		name: 'order'
	});

	return resource;
}]);