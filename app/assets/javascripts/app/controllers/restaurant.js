'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantController', ['$scope','Restaurant','$routeParams', function($scope, Restaurant, $routeParams){
	$scope.restaurant = {};

	Restaurant.query({id: $routeParams.id}).then(function(restaurant){
		$scope.restaurant = restaurant;
	});

}]);