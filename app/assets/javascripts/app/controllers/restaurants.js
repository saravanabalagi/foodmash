'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantsController', ['$scope','Restaurant', function($scope, Restaurant){
	$scope.restaurants = {};

	Restaurant.query().then(function(restaurants){
		$scope.restaurants = restaurants;
	});

}]);