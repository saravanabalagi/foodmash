'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboDishesController', ['$scope', 'ComboDish', '$q', 'toaster', 'DishType', 'Dish', function($scope, ComboDish, $q, toaster, DishType, Dish){

	$scope.dish_types = {};
	$scope.combo_dishes = {};
	$scope.combo_dish = new ComboDish;
	$scope.dishes = {};

	DishType.query().then(function(dish_types){
		if(dish_types.length > 0){
			$scope.dish_types = dish_types;
		}else{
			$scope.dish_types = null;
		}
	}, function(err){
		$scope.dish_types = null;
	});

	$scope.loadDishes = function(dish_type_id){
		var d = $q.defer();
			Dish.query({dish_type_id: dish_type_id}).then(function(dishes){
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
		return d.promise;
	};

	$scope.loadComboDishes = function(combo_id){
		var d = $q.defer();
		ComboDish.query({combo_id: combo_id}).then(function(combo_dishes){
			if(combo_dishes.length > 0){
				$scope.combo_dishes = combo_dishes;
			}else{
				$scope.combo_dishes = new Array;
			}
			d.resolve(combo_dishes);
		}, function(err){
			$scope.combo_dishes = null;
			d.reject(err);
		});
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

}]);