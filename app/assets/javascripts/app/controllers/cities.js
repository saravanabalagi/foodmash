'use strict';

angular.module('foodmashApp.controllers')

.controller('CitiesController', ['$scope','City','$q','toaster', function($scope, City, $q, toaster){
	
	$scope.cities = {};
	$scope.city = new City;

	City.query().then(function(cities){
		if(cities.length > 0){
		  $scope.cities = cities;		
		}else{
		  $scope.cities = new Array;
		}
	}, function(err){
		$scope.cities = null;
	});

	$scope.addCity = function(addCross){
		if(!addCross){
			if(!$scope.addCityForm.$pristine){
				$scope.city.save().then(function(result){
					toaster.pop('success', 'A new City was created!');
					$scope.cities.unshift($scope.city);
					$scope.city = new City;
				}, function(err){
					toaster.pop('error', 'Failed to create new City!');
				});
			}
		}else{
			$scope.city = new City;
			d.resolve(null);
		}
	};

}]);