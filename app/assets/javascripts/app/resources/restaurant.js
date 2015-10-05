'use strict';

angular.module('foodmashApp.resources')

.factory('Restaurant', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/restaurants',
		name: 'restaurant'
	});

	resource.prototype.hasCombos = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('hasCombos')).then(function(response){
			d.resolve(combos);
		 }, function(err){
		 	d.reject(err);
		 });
		return d.promise;
	  };

	  resource.hasDishType = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('hasDishType')).then(function(response){
			d.resolve(response);
		 }, function(err){
		 	d.reject(err);
		 });
		return d.promise;
	  };

	  resource.prototype.getCartsForRestaurant = function(){
	  	var self = this;
	  	var d = $q.defer();
	  	resource.$get(self.$url('getCartsForRestaurant')).then(function(response){
	  		d.resolve(response);
	  	}, function(err){
	  		d.reject(err);
	  	})
	  	return d.promise;
	  };

	return resource;
}]);