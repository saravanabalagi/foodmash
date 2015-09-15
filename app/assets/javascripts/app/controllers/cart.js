'use strict';

angular.module('foodmashApp.controllers')

.controller('CartController', ['$scope', '$q', 'toaster','$location','CartService','$timeout', function($scope, $q, toaster, $location, CartService, $timeout){

	$scope.cart = {};

	$scope.routeToRoot = function(){
		$location.path("/");
	};

	$scope.routeToCheckout = function(){
		$location.path("/checkout");
	};

	$scope.checkForOrders = function(){
		return $scope.cart.orders.length == 0;
	};

	CartService.getCartInfo().then(function(cart){
		$scope.cart = cart;
	}, function(cart){
		$scope.cart = cart;
	});

	function updateCartInfo(){
		var total = 0;
		$scope.cart.orders.filter(function(order){ 
			var currTotal = order.price * order.quantity;
			total += currTotal;
			order.total = currTotal;
		});
		$scope.cart.total = total;
	};

}]);