'use strict';

angular.module('foodmashApp.directives')

.directive('comboOptionDish', ['ComboOptionDish', '$q', 'Dish', 'toaster', function(ComboOptionDish, $q, Dish, toaster){

	return {

		restrict: 'A', 

		templateUrl: '/templates/combo-option-dish.html',

		controller: ['$scope', 'ComboOptionDish', '$q', 'Dish', 'toaster', function($scope, ComboOptionDish, $q, Dish, toaster){

			$scope.updatedComboOptionDish = new ComboOptionDish;
			$scope.dishes_for_update = [];
			$scope.loadingDishesForComboOptionDishUpdate = true;

			$scope.selectRestaurantForComboOptionDishesUpdate = function(restaurant){
				$scope.selectedRestaurantForComboOptionDishesUpdate = restaurant;
                $scope.loadDishesForUpdate(restaurant.id);
			};

			$scope.selectDishForComboOptionDishesUpdate = function(dish){
				$scope.selectedDishForComboOptionDishesUpdate = dish;
				$scope.updatedComboOptionDish.dish_id = dish.id;
			};

			$scope.loadDishesForUpdate = function(restaurant_id){
				var d = $q.defer();
				Dish.query({dish_type_id: $scope.combo_option.dish_type_id, restaurant_id: restaurant_id}).then(function(dishes){
					if(dishes.length > 0){
						$scope.dishes_for_update = dishes;
					}else{
						$scope.dishes_for_update = null;
					}
					$scope.loadingDishesForComboOptionDishUpdate = false;
				}, function(err){
					$scope.dishes_for_update = null;
				});
				return d.promise;
			};

			$scope.setUpdate = function(combo_option_dish){
				$scope.updatedComboOptionDish = angular.copy(combo_option_dish);
			};

			$scope.updateComboOptionDish = function(comboOptionDishUpdateCross){
				var d = $q.defer();
				$scope.updatedComboOptionDish.update().then(function(response){
					toaster.pop('success', 'Updated Combo Option Dish!');
					$scope.combo_option_dish = $scope.updatedComboOptionDish;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Could not update the Combo Option Dish!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.deleteComboOptionDish = function(combo_option_dish, combo_option_dishes){
				var d = $q.defer();
				combo_option_dish.delete().then(function(response){
					toaster.pop('success', 'Combo Option Dish was deleted!');
					combo_option_dishes.splice(combo_option_dishes.indexOf(combo_option_dish), 1);
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo Option Dish was not deleted!');
					d.reject(err);
				});
				return d.promise;
			};

		}]

	};

}]);