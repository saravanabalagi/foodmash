'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantsController', ['$scope','Restaurant','$q','toaster', function($scope, Restaurant, $q, toaster){
	$scope.restaurant = new Restaurant;
	$scope.restaurants = {};

	Restaurant.query().then(function(restaurants){
		if(restaurants.length > 0){
			$scope.restaurants = restaurants;
		}
	});

	$scope.addRestaurant = function(){
		var d = $q.defer();
		if(!$scope.restaurantAddForm.$pristine){
			$scope.restaurant.save().then(function(response){
				toaster.pop('success', 'Restaurant was created!');
				$scope.restaurants.unshift($scope.restaurant);
				d.resolve(response);
			}, function(err){
				toaster.pop('error', 'Restaurant was not created!');
				d.reject(err);
			});
		}else{
			d.reject(null);
		}
		return d.promise;
	};

}]);