'use strict';

angular.module('foodmashApp.controllers')

.controller('CartController', ['$scope', '$q', 'toaster','$location','Cart','$timeout', function($scope, $q, toaster, $location, Cart, $timeout){

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

	Cart.query().then(function(cart){
		$scope.cart = cart;
	}, function(err){
		$scope.cart = null;
	});

}]);