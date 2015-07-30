'use strict';

angular.module('foodmashApp.resources')

.factory('Combo', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/combos',
		name: 'combo'
	});

	resource.loadOfferCombos = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('getOfferCombos')).then(function(offerCombos){
			d.resolve(offerCombos);
		}, 
		function(err){ d.reject(err); });

		return d.promise;
	};

	resource.loadMicroCombos = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('getMicroCombos')).then(function(offerCombos){
			d.resolve(offerCombos);
		}, 
		function(err){ d.reject(err); });

		return d.promise;
	};

	resource.loadMediumCombos = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('getMediumCombos')).then(function(offerCombos){
			d.resolve(offerCombos);
		}, 
		function(err){ d.reject(err); });

		return d.promise;
	};

	resource.loadMegaCombos = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('getMegaCombos')).then(function(offerCombos){
			d.resolve(offerCombos);
		}, 
		function(err){ d.reject(err); });

		return d.promise;
	};

	return resource;
}]);