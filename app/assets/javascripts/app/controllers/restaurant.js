'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantController', ['$scope','Restaurant','$routeParams','toaster','$q','$location','DishType', function($scope, Restaurant, $routeParams, toaster, $q, $location, DishType){
	$scope.restaurant = {};
	$scope.combos = {};
	$scope.updatedRestaurant = new Restaurant;

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
		}
	});

	$scope.deleteRestaurant = function(){
		var d = $q.defer();
		$scope.restaurant.delete().then(function(response){
			toaster.pop('success', 'Restaurant was deleted!');
			d.resolve(response);
			$location.path("/restaurant");
		}, function(err){
			toaster.pop('alert', 'Restaurant was not deleted!');
			d.reject(err);
		});
		return d.promise;
	};

	$scope.setUpdate = function(r){
		$scope.updatedRestaurant = angular.copy(r);
	};

		
	$scope.updateRestaurant = function(updateCross){
		var d = $q.defer();
		if(!updateCross){
			if(!$scope.restaurantUpdateForm.$pristine){
				$scope.restaurant.update().then(function(response){
					toaster.pop('success', 'Restaurant was updated!');
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


}]);