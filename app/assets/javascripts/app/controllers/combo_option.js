'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboOptionController', ['$scope', 'ComboOptionDish', '$location', '$routeParams', 'toaster', '$q', 'Dish', 'ComboOption','$timeout', function($scope, ComboOptionDish, $location, $routeParams, toaster, $q, Dish, ComboOption, $timeout){

	$scope.dishes = {};
	$scope.combo_option_dishes = {};
	$scope.combo_option = {};
	$scope.combo_option_dish = new ComboOptionDish;
	$scope.loadingComboOptionDishes = true;

	$scope.$on('$viewContentLoaded', function(){
		$timeout(function(){
			angular.element(document.querySelector('#load-dishes')).triggerHandler('click');
		}, 1000)
	});

	$scope.$on('$viewContentLoaded', function(){
		$timeout(function(){
			angular.element(document.querySelector('#load-combo-option-dishes')).triggerHandler('click');
		}, 1000)
	});

	ComboOption.query({id: $routeParams.id}).then(function(combo_options){
		if(combo_options.length > 0){
			$scope.combo_option = combo_options[0];
		}else{
			$scope.combo_option = null;
		}
	}, function(err){
		$scope.combo_option = null;
	});


    $scope.loadComboOptionDishes = function(combo_option_id){
        var d = $q.defer();
        ComboOptionDish.query({combo_option_id: combo_option_id}).then(function(combo_option_dishes){
            if(combo_option_dishes.length > 0){
                $scope.combo_option_dishes = combo_option_dishes;
            }else{
                $scope.combo_option_dishes = new Array;
            }
            d.resolve(combo_option_dishes);
        }, function(err){
            $scope.combo_option_dishes = null;
            d.reject(err);
        });
        $scope.loadingComboOptionDishes = false;
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

	$scope.addComboOptionDish = function(comboOptionDishesAddCross, combo_option_id){
		var d = $q.defer();
		$scope.combo_option_dish.combo_option_id = combo_option_id;
		if(!comboOptionDishesAddCross){
			if(!$scope.comboOptionDishAddForm.$pristine){
				$scope.combo_option_dish.save().then(function(response){
					toaster.pop('success', 'Combo Option Dish was created!');
					$scope.combo_option_dishes.unshift($scope.combo_option_dish);
					$scope.combo_option_dish = new ComboOptionDish;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo Option Dish was not created!');
					d.reject(err);
				});
			}else{
				d.resolve(null);
			}
		}else{
			$scope.combo_option_dish = new ComboOptionDish;
			d.resolve(null);
		}
		return d.promise;
	};

}]);