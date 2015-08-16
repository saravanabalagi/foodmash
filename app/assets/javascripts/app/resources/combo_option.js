'use strict';

angular.module('foodmashApp.resources')

.factory('ComboOption', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/combo_options',
		name: 'combo_option'
	});

	return resource;
}]);