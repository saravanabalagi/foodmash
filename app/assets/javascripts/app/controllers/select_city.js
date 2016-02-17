'use strict';

angular.module('foodmashApp.controllers')

.controller('SelectCityController', ['$scope', '$location', 'toaster', 'CartService', 'City', '$rootScope', function($scope, $location, toaster, CartService, City, $rootScope){

		$scope.loadingCities = true;

		City.setCity().then(function(cities){
			if(cities.length > 0){
				$scope.cities = cities;
				$scope.selectedCity = cities[0];
				$rootScope.city = $scope.selectedCity;
				$scope.selectedArea = cities[0].areas[0];
				$rootScope.area = $scope.selectedArea;
			}else{
				$scope.cities = null;
			}
			$scope.loadingCities = false;
		}, function(err){
			$scope.cities = null;
			$scope.loadingCities = false;
		});

		$scope.selectCity = function(city){
			$scope.selectedCity = city;
			$rootScope.city = city;
		};

		$scope.selectArea = function(area){
			$scope.selectedArea = area;
			$rootScope.area = area;
		};

}]);

