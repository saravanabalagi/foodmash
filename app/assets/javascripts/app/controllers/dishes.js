'use strict';

angular.module('foodmashApp.controllers')

.controller('DishesController', ['$scope', 'Dish','$q', 'toaster', function($scope, Dish, $q, toaster){

	$scope.dish = {};
	$scope.updatedDish = {};

}]);