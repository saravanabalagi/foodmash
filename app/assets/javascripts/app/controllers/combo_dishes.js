'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboDishesController', ['$scope', 'ComboDish', '$location', '$q', 'toaster','DishType','Dish', function($scope, ComboDish, $location, $q, toaster, DishType, Dish){

	$scope.dish_types = {};
	$scope.combo_dishes = {};
	$scope.combo_dish = new ComboDish;
	$scope.updatedComboDish = new ComboDish;	
	$scope.dishes = {};
	$scope.dishesForUpdate = {};

	DishType.query().then(function(dish_types){
		if(dish_types.length > 0){
			$scope.dish_types = dish_types;
		}else{
			$scope.dish_types = null;
		}
	}, function(err){
		$scope.dish_types = null;
	});

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

	$scope.setUpdate = function(combo_dish){
		$scope.updatedComboDish = angular.copy(combo_dish);
		$scope.loadDishesForUpdate(combo_dish.dish_type_id);
	};

	$scope.updateComboDish = function(combo_dish, comboDishUpdateCross){
		var d = $q.defer();
		if(!comboDishUpdateCross){
			$scope.updatedComboDish.update().then(function(response){
				toaster.pop('success', 'Combo Dish was updated!');
				var index = $scope.combo_dishes.indexOf(combo_dish);
				if(angular.isNumber(index)){
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

}]);