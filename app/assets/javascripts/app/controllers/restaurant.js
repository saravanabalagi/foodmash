'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantController', ['$scope','Restaurant','$routeParams', function($scope, Restaurant, $routeParams){
	$scope.restaurant = {};
	$scope.combos = {};

	Restaurant.query({id: $routeParams.id}).then(function(restaurants){
		if(restaurants.length > 0){
			$scope.restaurant = restaurants[0];
			$scope.restaurant.hasCombos().then(function(combos){
				$scope.combos = combos;
				console.log($scope.combos);
			});
		}
	});

}]);