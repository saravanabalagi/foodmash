'use strict';

angular.module('foodmashApp.controllers')

.controller('DishTypesController', ['$scope','DishType', function($scope, DishType){
	$scope.dish_types = {};

	DishType.query().then(function(dish_types){
		$scope.dish_types = dish_types;
	});

}]);