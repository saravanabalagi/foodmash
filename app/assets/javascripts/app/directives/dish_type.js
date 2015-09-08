'use strict';

angular.module('foodmashApp.directives')

.directive('dishType', ['toaster', '$location', 'DishType', '$q', function(toaster, $location, DishType, $q){

	return {

		restrict: 'E',

		templateUrl: '/templates/dish_type.html',

		controller: ['$scope', 'toaster', '$location', 'DishType', '$q', function($scope, toaster,$location, DishType, $q){

			$scope.updateDishType = new DishType;

			$scope.setUpdate = function(dish_type){
				$scope.updatedDishType = angular.copy(dish_type);
			};

			$scope.updateDishType = function(dish_type, updateCross){
				var d = $q.defer();
				if(!updateCross){
					if(!$scope.updateDishTypeForm.$pristine){
						$scope.updatedDishType.update().then(function(response){
							toaster.pop('success', 'Dish Type was successfully updated!');
							var index = $scope.dish_types.indexOf(dish_type);
							if(angular.isNumber(index)){
								$scope.dish_types[index] = $scope.updatedDishType;
							}
							d.resolve(response);
						}, function(err){
							toaster.pop('error', 'Dish Type was not updated!');
							d.reject(err);
						});
					}else{
						$scope.updatedDishType = new DishType;
						d.resolve(null);
					}
				 }
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
