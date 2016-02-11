'use strict';

angular.module('foodmashApp.controllers')

.controller('DishesController', ['$scope', 'Dish','$q', 'toaster','DishType','Cuisine', function($scope, Dish, $q, toaster, DishType, Cuisine){

	$scope.dishes = {};
	$scope.dish_types = {};
	$scope.cuisines = {};
	$scope.dish = new Dish;
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

	Cuisine.query().then(function(cuisines){
		if(cuisines.length > 0){
		  $scope.cuisines = cuisines;		
		}else{
		  $scope.cuisines = null;
		}
	}, function(err){
		$scope.cuisines = null;
	});

	$scope.$watch('restaurant', function(n, o){
		if(n.id && $scope.loadingDishes){
			$scope.loadDishes($scope.restaurant.id);
		}
	});

	$scope.loadDishes = function(restaurant_id){
		var d = $q.defer();
		Dish.query({restaurant_id: restaurant_id}).then(function(dishes){
			if(dishes.length > 0){
				$scope.dishes = dishes;
			}else{
				$scope.dishes = new Array;
			}
			d.resolve(dishes);
		}, function(err){
			$scope.dishes = null;
			d.reject(err);
		});	
		$scope.loadingDishes = false;
		return d.promise;
	};

	$scope.addDish = function(dishesAddCross, restaurant_id){
		var d = $q.defer();
		$scope.dish.restaurant_id = restaurant_id;
		if(!dishesAddCross){
			if(!$scope.dishAddForm.$pristine){
				$scope.dish.save().then(function(response){
					toaster.pop('success', 'A new Dish was created!');
					$scope.dishes.unshift($scope.dish);
					$scope.dish = new Dish;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Dish was not created!');
					d.reject(err);
				});
			}else{
				d.resolve(null);
			}
		}else{
			$scope.dish = new Dish;
			d.resolve(null);
		}
		return d.promise;
	};

}]);