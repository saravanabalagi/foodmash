'use strict';

angular.module('foodmashApp.directives')

.directive('restaurantList', ['Restaurant', '$q', '$location', 'toaster', function(Restaurant, $q, $location, toaster){

	return {

		restrict: 'E',

		templateUrl: '/templates/restaurant-list.html',

		controller: ['$scope', 'Restaurant', '$q', '$location', 'toaster', function($scope, Restaurant, $q, $location, toaster){

			$scope.updatedRestaurant = new Restaurant;

			$scope.routeToRestaurant = function(restaurant){
				$location.path("/restaurants/" + restaurant.id);
			};

			$scope.setUpdate = function(restaurant){
				$scope.updatedRestaurant = angular.copy(restaurant);
			};

			$scope.updateRestaurant = function(restaurant, updateCross){
				var d = $q.defer();
				if(!updateCross){
					if(!$scope.restaurantUpdateForm.$pristine){
						$scope.updatedRestaurant.update().then(function(response){
							toaster.pop('success', 'Restaurant was updated!');
							var index = $scope.restaurants.indexOf(restaurant);
							if(angular.isNumber(index)){
								$scope.restaurants[index] = $scope.updatedRestaurant;
							}
							d.resolve(response);
						}, function(err){
							toaster.pop('error', 'Restaurant failed to update!');
							d.reject(err);
						});
					}else{
						$scope.updatedRestaurant = new Restaurant;
						d.resolve(null);
					}
				}
				return d.promise;
			};

			$scope.deleteRestaurant = function(restaurant){
				var d = $q.defer();
				restaurant.delete().then(function(response){
					$scope.restaurants.splice($scope.restaurants.indexOf(restaurant), 1);
					toaster.pop('success', 'Restaurant was deleted!');
					d.resolve(response);
				}, function(err){
					toaster.pop('alert', 'Restaurant was not deleted!');
					d.reject(err);
				});
				return d.promise;
			};


		}]

	};

}]);