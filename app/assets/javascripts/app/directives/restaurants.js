'use strict';

angular.module('foodmashApp.directives')

.directive('restaurants', ['toaster', 'Restaurant', '$q', 'PackagingCentre', 'Areas', function(toaster, Restaurant, $q, PackagingCentre, Areas){

	return {

		restrict: 'E',

		templateUrl: '/templates/restaurants.html',

		controller: ['$scope', 'toaster', 'Restaurant', '$q', 'PackagingCentre', 'Areas', function($scope, toaster, Restaurant, $q, PackagingCentre, Areas){

			$scope.restaurant = new Restaurant;
			$scope.restaurants = [];
			$scope.loadingRestaurants = true;
			$scope.areas = [];

			Areas.query().then(function(areas){
				if(areas.length > 0){
					$scope.areas = areas;
				}else{
					$scope.areas = null;
				}
			}, function(err){
				$scope.areas = null;
			});

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

			$scope.addRestaurant = function(){
				var d = $q.defer();
				$scope.restaurant.save().then(function(response){
					toaster.pop('success', 'Restaurant was created!');
					$scope.restaurants.unshift($scope.restaurant);
					$scope.restaurant = new Restaurant;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Restaurant was not created!');
					d.reject(err);
				});
				return d.promise;
			};

		}]

	};

}]);