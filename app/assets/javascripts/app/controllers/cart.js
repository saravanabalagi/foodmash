'use strict';

angular.module('foodmashApp.controllers')

.controller('CartController', ['$scope', '$q', 'toaster','$location','CartService','$timeout','$rootScope', function($scope, $q, toaster, $location, CartService, $timeout, $rootScope){

	$scope.cart = {};
	$scope.filling = false;

	CartService.getCartInfo().then(function(cart){
		$scope.cart = cart;
		validateCart();
	}, function(cart){
		$scope.cart = cart;
	});

	$scope.routeToRoot = function(){
		$location.path("/");
	};

	$scope.routeToCheckout = function(){
		if($rootScope.currentUser){
			$location.path("/checkout");
		}else{
			$rootScope.storeLocation = "/checkout";
			toaster.pop('warning', 'Need to login first!');
			$location.path("/login");
		}
	};

	$scope.checkForOrders = function(){
		return $scope.cart.orders.length == 0;
	};

	$scope.updateCartInfo = function(){
		var total = 0;
		$scope.cart.orders.filter(function(order){ 
			total += order.total * order.quantity;
		});
		console.log(total);
		$scope.cart.total = total;
	};

	function validateCart(){
		$scope.cart.orders.filter(function(order){
			if(order.quantity === null){
				order.quantity = 1;
				$scope.updateCartInfo();
			}
		});
	};

}]);