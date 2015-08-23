'use strict';

angular.module('foodmashApp.controllers')

.controller('CartController', ['$scope', '$q', 'toaster','$location','Cart', function($scope, $q, toaster, $location, Cart){

	$scope.routeToRoot = function(){
		$location.path("/");
	};

	$scope.routeToCheckout = function(){
		$location.path("/checkout");
	};

}]);