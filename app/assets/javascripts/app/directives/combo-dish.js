'use strict';

angular.module('foodmashApp.directives')

.directive('comboDish', ['ComboDish', '$q', 'toaster', 'DishType', 'Dish', '$location', function(ComboDish, $q, toaster, DishType, Dish, $location){

	return {

		restrict: 'E',

		templateUrl: '/templates/combo-dish.html',

		controller: ['$scope', 'ComboDish', '$q', 'toaster', 'DishType', 'Dish', function($scope, ComboDish, $q, toaster, DishType, Dish){

			$scope.updatedComboDish = new ComboDish;	
			$scope.dishesForUpdate = {};

			$scope.setUpdate = function(combo_dish){
				$scope.updatedComboDish = angular.copy(combo_dish);
				$scope.loadDishesForUpdate(combo_dish.dish_type_id);
			};

			$scope.loadDishesForUpdate = function(dish_type_id){
				var d = $q.defer();
					Dish.query({dish_type_id: dish_type_id}).then(function(dishes){
					if(dishes.length > 0){
						$scope.dishesForUpdate = dishes;
						d.resolve(dishes);
					}else{
						$scope.dishesForUpdate = null;
						d.resolve(null);
					}
					}, function(err){
						$scope.dishesForUpdate = null;
						d.reject(err);
					});
				return d.promise;
			};
			

			$scope.updateComboDish = function(combo_dish, comboDishUpdateCross){
				var d = $q.defer();
				if(!comboDishUpdateCross){
					if(!$scope.comboDishUpdateForm.$pristine){
						$scope.updatedComboDish.update().then(function(response){
							toaster.pop('success', 'Combo Dish was updated!');
							var index = $scope.combo_dishes.indexOf(combo_dish);
							if(angular.isNumber(index) && index >= 0){
								$scope.combo_dishes[index] = $scope.updatedComboDish;
							}
							d.resolve(response);
						}, function(err){
							toaster.pop('Combo Dish was not updated!');
							d.reject(err);
						});
					}else{
						$scope.updatedComboDish = new ComboDish;
						d.resolve(null);
					}
				}
				return d.promise;
			};

			$scope.deleteComboDish = function(combo_dish){
				var d = $q.defer();
				combo_dish.delete().then(function(response){
					toaster.pop('success', 'Combo Dish was deleted!');
					$scope.combo_dishes.splice($scope.combo_dishes.indexOf(combo_dish), 1);
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo Dish was not deleted!');
					d.reject(err);
				});
				return d.promise;
			};

		}]

	};

}]);