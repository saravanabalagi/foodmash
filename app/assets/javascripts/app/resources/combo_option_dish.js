'use strict';

angular.module('foodmashApp.resources')

.factory('ComboOptionDish', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/combo_option_dishes',
		name: 'combo_option_dish'
	});

	return resource;
}]);