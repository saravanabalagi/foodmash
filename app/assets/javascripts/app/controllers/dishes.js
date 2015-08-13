'use strict';

angular.module('foodmashApp.controllers')

.controller('DishesController', ['$scope', 'Dish','$q', 'toaster','DishType', function($scope, Dish, $q, toaster, DishType){

	$scope.dish = {};
	$scope.updatedDish = {};
	$scope.dish_types = {};

	DishType.query().then(function(dish_types){
		$scope.dish_types = dish_types;		
	}, function(err){
		$scope.dish_types = null;
	});

	$scope.addDish = function(dishesAddCross){
		var d = $q.defer();
		if(!dishesAddCross){
			if(!$scope.dishAddForm.$pristine){
				$scope.dish.save().then(function(response){
					toaster.pop('success', 'A new Dish was created!');
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