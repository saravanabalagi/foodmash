'use strict';

angular.module('foodmashApp.directives')

.directive('comboOptionDishes', ['ComboOptionDish', '$q', 'Dish', 'toaster', 'ComboService', function(ComboOptionDish, $q, Dish, toaster, ComboService){

	return {

		restrict: 'A', 

		templateUrl: '/templates/combo-option-dishes.html',

		controller: ['$scope', 'ComboOptionDish', '$q', 'Dish', 'toaster', 'ComboService', function($scope, ComboOptionDish, $q, Dish, toaster, ComboService){

			$scope.combo_option_dishes = [];
			$scope.combo_option_dish = new ComboOptionDish;
			$scope.dishes = [];
			$scope.restaurants = [];

			ComboService.getRestaurantsForCombo($scope.combo.packaging_centre_id).then(function(restaurants){
				$scope.restaurants = restaurants;
			}, function(err){
				$scope.restaurants = null;
			});

			$scope.$watch('combo_option', function(n, o){
				if(n.id){
					if($scope.combo_option.combo_option_dishes && $scope.combo_option.combo_option_dishes.length > 0){
						$scope.combo_option.combo_option_dishes.filter(function(cod){
							$scope.combo_option_dishes.push(new ComboOptionDish(cod));
						});
					}else{
						$scope.combo_option_dishes = new Array;
					}
				}
			});

			$scope.selectDishTypeForComboOptionDishes = function(dish_type){
				$scope.selectedDishTypeForComboOptionDishes = dish_type;
				$scope.loadDishes($scope.selectedRestaurantForComboOptionDishes.id, $scope.selectedDishTypeForComboOptionDishes.id);
			};

			$scope.selectRestaurantForComboOptionDishes = function(restaurant){
				$scope.selectedRestaurantForComboOptionDishes = restaurant;
				$scope.loadDishes($scope.selectedRestaurantForComboOptionDishes.id, $scope.selectedDishTypeForComboOptionDishes.id);
			};

			$scope.selectDishForComboOptionDishes = function(dish){
				$scope.selectedDishForComboOptionDishes = dish;
				$scope.combo_option_dish.dish_id = dish.id;
			};

			$scope.loadDishes = function(restaurant_id, dish_type_id){
				var d = $q.defer();
				Dish.query({dish_type_id: dish_type_id, restaurant_id: restaurant_id}).then(function(dishes){
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

			$scope.addComboOptionDish = function(combo_option_id){
				var d = $q.defer();
				$scope.combo_option_dish.combo_option_id = combo_option_id;
				$scope.combo_option_dish.save().then(function(response){
					toaster.pop('success', 'Combo Option Dish was created!');
					$scope.combo_option_dishes.unshift($scope.combo_option_dish);
					$scope.combo_option_dish = new ComboOptionDish;
					renewSelectedValues(combo_option_id);
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo Option Dish was not created!');
					d.reject(null);
				});
				return d.promise;
			};

			function renewSelectedValues(combo_option_id){
				$scope.combo_option_dish.dish_id = $scope.selectedDishForComboOptionDishes.id;
				$scope.combo_option_dish.combo_option_id = combo_option_id;
			};

		}]

	};

}]);