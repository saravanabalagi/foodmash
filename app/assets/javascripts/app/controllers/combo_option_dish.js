
'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboOptionDishController', ['ComboOptionDish', 'Dish', '$location', 'toaster', '$q','$timeout','$scope', function(ComboOptionDish, Dish, $location, toaster, $q, $timeout, $scope){

		$scope.updatedComboOptionDish = new ComboOptionDish;

		$scope.setUpdate = function(combo_option_dish){
			$scope.updatedComboOptionDish = angular.copy(combo_option_dish);
			$scope.loadDishes(combo_option_dish.combo_option);
		};

		$scope.loadDishes = function(combo_option){
			var d = $q.defer();
			Dish.query({dish_type_id: combo_option.dish_type_id}).then(function(dishes){
				if(dishes.length > 0){
					$scope.dishes = dishes;
				}else{
					$scope.dishes = null;
				}
			}, function(err){
				$scope.dishes = null;
			});
			return d.promise;
		};

		$scope.updateComboOptionDish = function(comboOptionDishUpdateCross){
			var d = $q.defer();
			if(!comboOptionDishUpdateCross){
				$scope.updatedComboOptionDish.update().then(function(response){
					toaster.pop('success', 'Updated Combo Option Dish!');
					$scope.combo_option_dish = $scope.updatedComboOptionDish;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Could not update the Combo Option Dish!');
					d.reject(err);
				});
			}else{
				$scope.updatedComboOptionDish = new ComboOptionDish;
				d.resolve(null);
			}
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

}]);

