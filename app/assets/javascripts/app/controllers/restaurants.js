'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantsController', ['$scope','Restaurant','$q','toaster','$location', function($scope, Restaurant, $q, toaster, $location){
	$scope.restaurant = new Restaurant;
	$scope.restaurants = {};
	$scope.updatedRestaurant = {};

	Restaurant.query().then(function(restaurants){
		if(restaurants.length > 0){
			$scope.restaurants = restaurants;
		}
	});

	$scope.routeToRestaurant = function(r){
		$location.path("restaurant/" + r.id);
	};

	$scope.setUpdate = function(r){
		$scope.updatedRestaurant = angular.copy(r);
	};

	$scope.updateRestaurant = function(r, cross){
		var d = $q.defer();
		if(!cross){
			$scope.updatedRestaurant.update().then(function(response){
				toaster.pop('success', 'Restaurant was updated!');
				var index = $scope.restaurants.indexOf(r);
				if(index){
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

	$scope.addRestaurant = function(){
		var d = $q.defer();
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
		return d.promise;
	};

	$scope.deleteRestaurant = function(r){
		r.delete().then(function(){
			$scope.restaurants.splice($scope.restaurants.indexOf(r), 1);
			toaster.pop('success', 'Restaurant was deleted!');
		}, function(){
			toaster.pop('alert', 'Restaurant was not deleted!');
		});
	};

}]);