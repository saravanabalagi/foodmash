'use strict';

angular.module('foodmashApp.controllers')

.controller('CartPaymentController', ['$scope', '$q', 'toaster','$location','Cart','CartService', function($scope, $q, toaster, $location, Cart, CartService){

	$scope.cart = {};

	CartService.getCartInfo().then(function(cart){
		$scope.cart = cart;
	}, function(cart){
		$scope.cart = cart;
	});

	$scope.payCart = function(status){
		var d = $q.defer();
		Cart.changeStatus(status, $scope.cart.id).then(function(cart){
			toaster.pop('success', 'Cart status is changed to purchased!');
			$scope.cart = cart;
			CartService.refreshCart();
			d.resolve(null);
		}, function(err){
			toaster.pop('error', 'Cart status was not changed to purchased!');
			d.reject(err);
		});
		return d.promise;
	};

}]);