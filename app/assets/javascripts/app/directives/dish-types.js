'use strict';

angular.module('foodmashApp.directives')

.directive('dishTypes', ['toaster', 'DishType', '$q', function(toaster, DishType, $q){

	return {

		restrict: 'E',

		templateUrl: '/templates/dish_types.html',

		controller: ['$scope', 'toaster', 'DishType', '$q', function($scope, toaster, DishType, $q){

			$scope.dish_types = [];
			$scope.dish_type = new DishType;
			$scope.loadingDishTypes = true;

			DishType.query().then(function(dish_types){
				if(dish_types.length > 0){
				  $scope.dish_types = dish_types;		
				}else{
				  $scope.dish_types = new Array;
				}
				$scope.loadingDishTypes = false;
			}, function(err){
				$scope.dish_types = null;
				$scope.loadingDishTypes = false;
			});

			$scope.addDishType = function(){
				$scope.dish_type.save().then(function(result){
					toaster.pop('success', 'A new Dish Type was created!');
					$scope.dish_types.unshift($scope.dish_type);
					$scope.dish_type = new DishType;
				}, function(err){
					toaster.pop('error', 'Failed to create new Dish Type');
				});
			};

		}]

	};

}]);
