'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantsController', ['$scope','Restaurant','$q','toaster', function($scope, Restaurant, $q, toaster){
	$scope.restaurant = new Restaurant;
	$scope.restaurants = {};
	$scope.loadingRestaurants = true;

	Restaurant.query().then(function(restaurants){
		if(restaurants.length > 0){
			$scope.restaurants = restaurants;
		}else{
			$scope.restaurants = new Array;
		}
		$scope.loadingRestaurants = false;
	}, function(err){
		$scope.restaurants = null;
		$scope.loadingRestaurants = false;
	});

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

}]);