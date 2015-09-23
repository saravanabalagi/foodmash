'use strict';

angular.module('foodmashApp.controllers')

.controller('CartPaymentController', ['$scope', '$q', 'toaster','$location','Cart','$timeout','$rootScope', function($scope, $q, toaster, $location, Cart, $timeout, $rootScope){

	$scope.cart = {};
	
	Cart.show().then(function(cart){
		$scope.cart = cart;
	}, function(err){
		$scope.cart = null;
	});

}]);