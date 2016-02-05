'use strict';

angular.module('foodmashApp.directives')

.directive('cities', ['toaster', 'City', '$q', '$location', function(toaster, City, $q, $location){

	return {

		restrict: 'E',

		templateUrl: '/templates/cities.html',

		controller: ['$scope', 'toaster', 'City', '$q', '$location', function($scope, toaster, City, $q, $location){

			$scope.cities = [];
			$scope.city = new City;
			$scope.loadingCities = true;

			City.query().then(function(cities){
				if(cities.length > 0){
				  $scope.cities = cities;		
				}else{
				  $scope.cities = new Array;
				}
				$scope.loadingCities = false;
			}, function(err){
				$scope.cities = null;
				$scope.loadingCities = false;
			});

			$scope.addCity = function(){
				$scope.city.save().then(function(result){
					toaster.pop('success', 'A new City was created!');
					$scope.cities.unshift($scope.city);
					$scope.city = new City;
				}, function(err){
					toaster.pop('error', 'Failed to create new City!');
				});
			};

		}]

	};

}]);