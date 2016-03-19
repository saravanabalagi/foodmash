'use strict';

angular.module('foodmashApp.resources')

.factory('Payment', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/payments', 
		name: 'payment'
	});

	resource.getHash = function(setup_details){
		var self = this;
		var d = $q.defer();
		resource.$post(self.$url('getHash'), {setup_details: setup_details}).then(function(response){
			d.resolve(response);
		}, function(err){ d.reject(err); })
		return d.promise;
	};

	resource.purchaseForCod = function(cart){
		var self = this;
		var d = $q.defer();
		resource.$post(self.$url('purchaseForCod'), {cart: cart}).then(function(response){
			d.resolve(response);
		}, function(err){ d.reject(err); })
		return d.promise;
	};

	return resource;
}]);