'use strict';

angular.module('foodmashApp.controllers')

.controller('CustomerPanelController', ['$scope','$location','toaster','$rootScope','Cart', function($scope, $location, toaster, $rootScope, Cart){

	$scope.carts = [];
	$scope.loadingPurchasedCarts = true;

	Cart.purchasedCarts().then(function(carts){
		if(carts){
			$scope.carts = carts;
		}else{
			$scope.carts = null;
		}
		$scope.loadingPurchasedCarts = false;
	}, function(err){
		$scope.carts = null;
		$scope.loadingPurchasedCarts = false;
	});

}]);