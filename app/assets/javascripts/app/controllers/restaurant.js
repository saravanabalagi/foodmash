'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantController', ['$scope','Restaurant','$routeParams','toaster','$q', function($scope, Restaurant, $routeParams, toaster, $q){
	$scope.restaurant = {};
	$scope.combos = {};

	Restaurant.query({id: $routeParams.id}).then(function(restaurants){
		if(restaurants.length > 0){
			$scope.restaurant = restaurants[0];
			$scope.restaurant.hasCombos().then(function(combos){
				$scope.combos = combos;
			});
		}
	});

		
	$scope.updateRestaurant = function(){
		var d = $q.defer();
		if(!$scope.restaurantUpdateForm.$pristine){
			$scope.restaurant.update().then(function(result){
				toaster.pop('success', 'Restaurant was updated!');
				d.resolve(result);
			}, function(err){
				toaster.pop('alert', 'Restaurant was not updated!');
				d.reject(err);
			});
		}else{
			d.resolve(null);
		}
		return d.promise;
	};

}]);