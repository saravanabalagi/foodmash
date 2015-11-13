'use strict';

angular.module('foodmashApp.controllers')

.controller('CheckoutController', ['$scope', '$q', 'toaster','$location','$rootScope','DeliveryAddress','CartService','Cart', function($scope, $q, toaster, $location, $rootScope, DeliveryAddress, CartService, Cart){

	$scope.delivery_addresses = {};
	$scope.delivery_address = new DeliveryAddress;
	$scope.cart = {};

	CartService.getCartInfo().then(function(cart){
		if(cart.orders.length == 0){
			toaster.pop('warning', 'Cart is empty!');
			$location.path("/cart");
		}else{
			$scope.cart = cart;
		}
	}, function(cart){
		$scope.cart = cart;
	});

	DeliveryAddress.query({user_id: $rootScope.currentUser.id}).then(function(delivery_addresses){
		if(delivery_addresses.length > 0){
			$scope.delivery_addresses = delivery_addresses;
			$scope.delivery_addresses.filter(function(delivery_address){
				if(delivery_address.primary == true){
					$scope.cart_delivery_address_id = delivery_address.id
				}
			});
		}else{
			$scope.delivery_addresses = new Array;
		}
	}, function(err){
		$scope.delivery_addresses = null;
	});

	$scope.routeToCart = function(){
		$location.path("/cart");
	};

	$scope.processCart = function(){
		$scope.cart.delivery_address_id = parseInt($scope.cart_delivery_address_id, 10);
		var d = $q.defer();
		Cart.addToCart($scope.cart).then(function(cart){
			toaster.pop('success', 'Cart was submitted!');
			CartService.setCartInfo(cart);
			$location.path("/cartPayment");
			d.resolve(cart);
		}, function(err){
			toaster.pop('error', 'Cart was not submitted!');
			d.reject(err);
		});
		return d.promise;
	};

	$scope.addDeliveryAddress = function(addCross){
		var d = $q.defer();
		if(!addCross){
			if(!$scope.deliveryAddressAddForm.$pristine){
				$scope.delivery_address.save().then(function(response){
					toaster.pop('success', 'Delivery Address was created!');
					$scope.delivery_addresses.push($scope.delivery_address);
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

	$scope.reload = function(){
		var d = $q.defer();
		DeliveryAddress.query({user_id: $rootScope.currentUser.id}).then(function(delivery_addresses){
		if(delivery_addresses.length > 0){
			$scope.delivery_addresses = delivery_addresses;
			d.resolve(null);
		}else{
			$scope.delivery_addresses = new Array;
			d.resolve(null);
		}
	}, function(err){
		$scope.delivery_addresses = null;
		d.reject(err);
	});
		return d.promise;
	};

}]);