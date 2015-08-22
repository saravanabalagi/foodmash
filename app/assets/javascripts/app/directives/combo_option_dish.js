'use strict';

angular.module('foodmashApp.directives')

.directive('comboOptionDish', ['ComboOptionDish', 'Dish', '$location', 'toaster', '$q','$timeout', function(ComboOptionDish, Dish, $location, toaster, $q, $timeout){

	return {

		restrict: 'E',

		priority: 1001,

		templateUrl: '/templates/combo_option_dish.html',

		controller: ['ComboOptionDish', 'Dish', '$location', 'toaster', '$q','$timeout','$scope', function(ComboOptionDish, Dish, $location, toaster, $q, $timeout, $scope){

			$scope.updatedComboOptionDish = new ComboOptionDish;

			$scope.setUpdate = function(){
				$scope.updatedComboOptionDish = angular.copy($scope.combo_option_dish);
				$scope.loadDishes($scope.combo_option_dish.combo_option);
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

			$scope.updateComboOptionDish = function(){
				var d = $q.defer();
				if(!comboOptionDishUpdateCross){
					if(!$scope.comboOptionDishUpdateForm.$pristine){
						$scope.updatedComboOptionDish.update().then(function(response){
							toaster.pop('success', 'Updated Combo Option Dish!');
							$scope.combo_option_dish = $scope.updatedComboOptionDish;
							d.resolve(response);
						}, function(err){
							toaster.pop('error', 'Could not update the Combo Option Dish!');
							d.reject(err);
						});
					}else{
						d.resolve(null);
					}
				}else{
					d.resolve(null);
				}
				return d.promise;
			};

			$scope.deleteComboOptionDish = function(combo_option_dishes){
				var d = $q.defer();
				$scope.combo_option_dish.delete().then(function(response){
					toaster.pop('success', 'Combo Option Dish was deleted!');
					combo_option_dishes.splice(combo_option_dishes.indexOf($scope.combo_option_dish), 1);
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