'use strict';

angular.module('foodmashApp.controllers')

.controller('CartPaymentController', ['$scope', '$q', 'toaster','$location','Cart','CartService', function($scope, $q, toaster, $location, Cart, CartService){

	$scope.cart = {};

	CartService.getCartForPayment().then(function(cart){
		$scope.cart = cart;
	}, function(cart){
		$scope.cart = cart;
	});

}]);