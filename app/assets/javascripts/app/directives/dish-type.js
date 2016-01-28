'use strict';

angular.module('foodmashApp.directives')

.directive('dishType', ['toaster', 'DishType', '$q', function(toaster, DishType, $q){

	return {

		restrict: 'A',

		templateUrl: '/templates/dish_type.html',

		controller: ['$scope', 'toaster', 'DishType', '$q', function($scope, toaster, DishType, $q){

			$scope.updateDishType = new DishType;

			$scope.setUpdate = function(dish_type){
				$scope.updatedDishType = angular.copy(dish_type);
			};

			$scope.updateDishType = function(dish_type, updateCross){
				var d = $q.defer();
				$scope.updatedDishType.update().then(function(response){
					toaster.pop('success', 'Dish Type was successfully updated!');
					var index = $scope.dish_types.indexOf(dish_type);
					if(angular.isNumber(index) && index >= 0){
						$scope.dish_types[index] = $scope.updatedDishType;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Dish Type was not updated!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.deleteDishType = function(dish_type){
				var d = $q.defer();
				dish_type.delete().then(function(response){
					$scope.dish_types.splice($scope.dish_types.indexOf(dish_type), 1);
					toaster.pop('success', 'Dish Type was succussfully deleted!');
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Dish Type was not deleted!');
					d.reject(err);
				});
				return d.promise;
			};

		}]

	};

}]);
