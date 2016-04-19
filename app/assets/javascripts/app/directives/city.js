'use strict';

angular.module('foodmashApp.directives')

.directive('city', ['toaster', 'City', '$q', '$location', function(toaster, City, $q, $location){

	return {

		restrict: 'A',

		templateUrl: '/templates/city.html',

		controller: ['$scope', 'toaster', 'City', '$q', '$location', function($scope, toaster, City, $q, $location){

			$scope.updatedCity = new City;

			$scope.routeToAreas = function(){
				$location.path("/cities/" + $scope.city.id + '/areas');
			};

			$scope.setUpdate = function(city){
				$scope.updatedCity = angular.copy(city);
			};

			$scope.updateCity = function(city){
				var d = $q.defer();
				$scope.updatedCity.update().then(function(response){
					toaster.pop('success', 'City was successfully updated!');
					var index = $scope.cities.indexOf(city);
					if(angular.isNumber(index) && index >= 0){
						$scope.cities[index] = $scope.updatedCity;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'City was not updated!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.deleteCity = function(city){
				var d = $q.defer();
				if(confirm('Are you sure ?')){
					city.delete().then(function(response){
						$scope.cities.splice($scope.cities.indexOf(city), 1);
						toaster.pop('success', 'City was succussfully deleted!');
						d.resolve(response);
					}, function(err){
						toaster.pop('error', 'City was not deleted!');
						d.reject(err);
					});
				}
				return d.promise;
			};

		}]

	};

}]);