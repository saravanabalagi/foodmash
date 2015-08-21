'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantController', ['$scope','Restaurant','$routeParams','toaster','$q','$location','DishType','$timeout', function($scope, Restaurant, $routeParams, toaster, $q, $location, DishType, $timeout){
	$scope.restaurant = {};
	$scope.combos = {};
	$scope.updatedRestaurant = new Restaurant;

	$scope.$on('$viewContentLoaded', function() {
    $timeout(function() {
    	    angular.element(document.querySelector('#load-dishes')).triggerHandler('click');
    	}, 1000);
	});

	Restaurant.query({id: $routeParams.id}).then(function(restaurants){
		if(restaurants.length > 0){
			$scope.restaurant = restaurants[0];
			$scope.restaurant.hasCombos().then(function(combos){
				if(combos.length > 0){
					$scope.combos = combos;
				}else{
					$scope.combos = null;
				}
			}, function(err){
				$scope.combos = null;
			});
		}else{
			$scope.restaurant = null;
		}
	});

	$scope.setUpdate = function(restaurant){
		$scope.updatedRestaurant = angular.copy(restaurant);
	};

	$scope.updateRestaurant = function(updateCross){
		var d = $q.defer();
		if(!updateCross){
			if(!$scope.restaurantUpdateForm.$pristine){
				$scope.updatedRestaurant.update().then(function(response){
					toaster.pop('success', 'Restaurant was updated!');
					$scope.restaurant = $scope.updatedRestaurant;
					d.resolve(response);
				}, function(err){
					toaster.pop('alert', 'Restaurant was not updated!');
					d.reject(err);
				});
			}else{
				d.resolve(null);
			}
		}
		return d.promise;
	};

	$scope.deleteRestaurant = function(){
		var d = $q.defer();
		$scope.restaurant.delete().then(function(response){
			toaster.pop('success', 'Restaurant was deleted!');
			d.resolve(response);
			$location.path("/restaurants");
		}, function(err){
			toaster.pop('alert', 'Restaurant was not deleted!');
			d.reject(err);
		});
		return d.promise;
	};

}]);