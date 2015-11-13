'use strict';

angular.module('foodmashApp.resources')

.factory('DeliveryAddress', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/delivery_addresses',
		name: 'delivery_address'
	});

	return resource;
}]);