'use strict';

angular.module('foodmashApp.controllers')

.controller('CheckoutController', ['$scope', '$q', 'toaster','$location','$rootScope','DeliveryAddress', function($scope, $q, toaster, $location, $rootScope, DeliveryAddress){

	$scope.delivery_addresses = {};
	$scope.delivery_address = new DeliveryAddress;

	DeliveryAddress.query({user_id: $rootScope.currentUser.id}).then(function(delivery_addresses){
		if(delivery_addresses.length > 0){
			$scope.delivery_addresses = delivery_addresses;
		}else{
			$scope.delivery_addresses = new Array;
		}
	}, function(err){
		$scope.delivery_addresses = null;
	});

	$scope.routeToCart = function(){
		$location.path("/cart");
	};

	$scope.addDeliveryAddress = function(addCross){
		var d = $q.defer();
		if(!addCross){
			if(!$scope.deliveryAddressAddForm.$pristine){
				$scope.delivery_address.save().then(function(response){
					toaster.pop('success', 'Delivery Address was created!');
					$scope.delivery_addresses.unshift($scope.delivery_address);
					$scope.delivery_address = new DeliveryAddress;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Delivery Address was not created!');
					d.reject(err);
				});
			}else{
				d.resolve(null);
			}
		}else{
			$scope.delivery_address = new DeliveryAddress;
			d.resolve(null);
		}
		return d.promise;
	};

}]);