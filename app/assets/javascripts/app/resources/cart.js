'user strict';

angular.module('foodmashApp.resources')

.factory('Cart', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/carts',
		name: 'cart'
	});

	return resource;
}]);