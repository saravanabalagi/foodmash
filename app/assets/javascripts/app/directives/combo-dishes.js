'use strict';

angular.module('foodmashApp.directives')

.directive('comboDishes', ['ComboDish', '$q', 'toaster', 'DishType', 'Dish', '$location', 'Restaurant', function(ComboDish, $q, toaster, DishType, Dish, $location, Restaurant){

	return {

		restrict: 'A',

		templateUrl: '/templates/combo-dishes.html',

		controller: ['$scope', 'ComboDish', '$q', 'toaster', 'DishType', 'Dish', 'Restaurant', function($scope, ComboDish, $q, toaster, DishType, Dish, Restaurant){

			$scope.dish_types = [];
			$scope.restaurants = [];
			$scope.combo_dishes = [];
			$scope.combo_dish = new ComboDish;
			$scope.dishes = [];
			$scope.loadingDishes = true;

			DishType.query().then(function(dish_types){
				if(dish_types.length > 0){
					$scope.dish_types = dish_types;
				}else{
					$scope.dish_types = null;
				}
			}, function(err){
				$scope.dish_types = null;
			});

			Restaurant.query({packaging_centre_id: $scope.combo.packaging_centre_id}).then(function(restaurants){
				if(restaurants.length > 0){
					$scope.restaurants = restaurants;
				}else{
					$scope.restaurants = null;
				}
			}, function(err){	
				$scope.restaurants = null;
			});

			$scope.$watch('combo', function(n, o){
				if(n.id){
					if($scope.combo.combo_dishes && $scope.combo_dishes.length > 0){
						$scope.combo_dishes = $scope.combo.combo_dishes;
					}else{
						$scope.combo_dishes = new Array;
					}
				}
			});

			$scope.selectRestaurant = function(restaurant){
				$scope.selectedRestaurant = restaurant;
			};

			$scope.selectDishType = function(dish_type){
				$scope.selectedDishType = dish_type;
				$scope.loadDishes(dish_type.id, $scope.selectedRestaurant.id);
			};

			$scope.selectDish = function(dish){
				$scope.selectedDish = dish;
				$scope.combo_dish.dish_id = dish.id;
			};

			$scope.loadDishes = function(dish_type_id, restaurant_id){
				var d = $q.defer();
					Dish.query({dish_type_id: dish_type_id, restaurant_id: restaurant_id}).then(function(dishes){
					if(dishes.length > 0){
						$scope.dishes = dishes;
						d.resolve(dishes);
					}else{
						$scope.dishes = null;
						d.resolve(null);
					}
				}, function(err){
					$scope.dishes = null;
					d.reject(err);
				});
				$scope.loadingDishes = false;
				return d.promise;
			};

			$scope.addComboDish = function(comboDishesAddCross, combo_id){
				var d = $q.defer();
				$scope.combo_dish.combo_id = combo_id;
				if(!comboDishesAddCross){
					if(!$scope.comboDishAddForm.$pristine){
						$scope.combo_dish.save().then(function(response){
							toaster.pop('success', 'Combo Dish was created!');
							$scope.combo_dishes.unshift($scope.combo_dish);
							$scope.combo_dish = new ComboDish;
							d.resolve(response);
						}, function(err){
							toaster.pop('error', 'Combo Dish was not created!');
							d.reject(null);
						});
					}else{
						d.resolve(null);
					}
				}else{
					$scope.combo_dish = new ComboDish;
					d.resolve(null);
				}
				return d.promise;
			};

		}]

	};

}]);