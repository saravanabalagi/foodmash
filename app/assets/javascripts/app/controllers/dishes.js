'use strict';

angular.module('foodmashApp.controllers')

.controller('DishesController', ['$scope', 'Dish','$q', 'toaster','DishType', function($scope, Dish, $q, toaster, DishType){

	$scope.dish = new Dish;
	$scope.dishes = {};
	$scope.dish_types = {};
	$scope.updatedDish = new Dish;

	DishType.query().then(function(dish_types){
		$scope.dish_types = dish_types;		
	}, function(err){
		$scope.dish_types = null;
	});

	$scope.loadDishes = function(restaurant_id){
		var d = $q.defer();
		Dish.query({restaurant_id: restaurant_id}).then(function(dishes){
			$scope.dishes = dishes;
			d.resolve(dishes);
		}, function(err){
			$scope.dishes = null;
			d.reject(err);
		});	
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