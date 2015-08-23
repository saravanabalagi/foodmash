'use strict';

angular.module('foodmashApp.controllers')

.controller('CheckoutController', ['$scope', '$q', 'toaster','$location', function($scope, $q, toaster, $location){

	$scope.routeToCart = function(){
		$location.path("/cart");
	};

}]);