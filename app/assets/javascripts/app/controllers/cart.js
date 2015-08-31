'use strict';

angular.module('foodmashApp.controllers')

.controller('CartController', ['$scope', '$q', 'toaster','$location','Cart', function($scope, $q, toaster, $location, Cart){

	$scope.cart = {};

	$scope.routeToRoot = function(){
		$location.path("/");
	};

	$scope.routeToCheckout = function(){
		$location.path("/checkout");
	};

	$scope.checkForOrders = function(){
		console.log($scope.cart);
		return $scope.cart.orders.length == 0;
	};

	Cart.query().then(function(cart){
		$scope.cart = cart;
	}, function(err){
		$scope.cart = null;
	});

}]);