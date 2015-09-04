'use strict';

angular.module('foodmashApp.resources')

.factory('ComboDish', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){

	var resource = railsResourceFactory({
		url: '/web/combo_dishes',
		name: 'combo_dish'
	});

	return resource;
}]);