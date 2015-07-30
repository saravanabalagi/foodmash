'use strict';

angular.module('foodmashApp.resources', ['rails'])

.factory('Cart', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/carts',
		name: 'cart'
	});

	return resource;
}])

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
}])

.factory('ComboOption', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/combo_options',
		name: 'combo_option'
	});

	return resource;
}])

.factory('ComboOptionDish', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/combo_option_dishes',
		name: 'combo_option_dish'
	});

	return resource;
}])


.factory('User', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/users',
		name: 'user'
	});

	return resource;
}]);

