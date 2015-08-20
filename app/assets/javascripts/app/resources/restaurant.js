'use strict';

angular.module('foodmashApp.resources')

.factory('Restaurant', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/restaurants',
		name: 'restaurant'
	});

	resource.prototype.hasCombos = function(){
		var self = this;

		return resource.$get(self.$url('hasCombos')).then(function(combos){
			self.combos = combos;
			return self.combos;
		 });
		
	  };

	  resource.hasDishType = function(){
		var self = this;

		return resource.$get(self.$url('hasDishType')).then(function(restaurants){
			self.restaurants = restaurants;
			return self.restaurants;
		 });
		
	  };

	return resource;
}]);