'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantsController', ['$scope','Restaurant','$q','toaster','$location', function($scope, Restaurant, $q, toaster, $location){
	$scope.restaurant = new Restaurant;
	$scope.restaurants = {};
	$scope.updatedRestaurant = new Restaurant;

	Restaurant.query().then(function(restaurants){
		if(restaurants.length > 0){
			$scope.restaurants = restaurants;
		}else{
			$scope.restaurants = new Array;
		}
	}, function(err){
		$scope.restaurants = null;
	});

	$scope.routeToRestaurant = function(restaurant){
		$location.path("restaurants/" + restaurant.id);
	};

	$scope.setUpdate = function(restaurant){
		$scope.updatedRestaurant = angular.copy(restaurant);
	};

	$scope.updateRestaurant = function(restaurant, updateCross){
		var d = $q.defer();
		if(!updateCross){
			$scope.updatedRestaurant.update().then(function(response){
				toaster.pop('success', 'Restaurant was updated!');
				var index = $scope.restaurants.indexOf(restaurant);
				if(angular.isNumber(index)){
					$scope[index] = $scope.updatedRestaurant;
				}
				d.resolve(response);
			}, function(err){
				toaster.pop('error', 'Restaurant failed to update!');
				d.reject(err);
			});
		}
		return d.promise;
	};

	$scope.addRestaurant = function(addCross){
		var d = $q.defer();
		if(!addCross){
			if(!$scope.restaurantAddForm.$pristine){
				$scope.restaurant.save().then(function(response){
					toaster.pop('success', 'Restaurant was created!');
					$scope.restaurants.unshift($scope.restaurant);
					$scope.restaurant = new Restaurant;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Restaurant was not created!');
					d.reject(err);
				});
			}else{
				d.resolve(null);
			}
		}else{
			$scope.restaurant = new Restaurant;
			d.resolve(null);
		}
		return d.promise;
	};

	$scope.deleteRestaurant = function(restaurant){
		restaurant.delete().then(function(){
			$scope.restaurants.splice($scope.restaurants.indexOf(restaurant), 1);
			toaster.pop('success', 'Restaurant was deleted!');
		}, function(){
			toaster.pop('alert', 'Restaurant was not deleted!');
		});
	};

}]);