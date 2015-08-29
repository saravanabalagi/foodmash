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

	Cart.query().then(function(cart){
		console.log(cart);
		$scope.cart = cart;
	}, function(err){

	});

}]);