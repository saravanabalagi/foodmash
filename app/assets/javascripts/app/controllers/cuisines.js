'use strict';

angular.module('foodmashApp.controllers')

.controller('CuisinesController', ['$scope','Cuisine','$q','toaster', function($scope, Cuisine, $q, toaster){
	$scope.cuisines = {};
	$scope.cuisine = new Cuisine;
	$scope.loadingCuisines = true;

	Cuisine.query().then(function(cuisines){
		if(cuisines.length > 0){
		  $scope.cuisines = cuisines;		
		}else{
		  $scope.cuisines = new Array;
		}
		$scope.loadingCuisines = false;
	}, function(err){
		$scope.cuisines = null;
		$scope.loadingCuisines = false;
	});

	$scope.addCuisine = function(addCross){
		if(!addCross){
			if(!$scope.addCuisineForm.$pristine){
				$scope.cuisine.save().then(function(result){
					toaster.pop('success', 'A new Cuisine was created!');
					$scope.cuisines.unshift($scope.cuisine);
					$scope.cuisine = new Cuisine;
				}, function(err){
					toaster.pop('error', 'Failed to create new Cuisine');
				});
			}
		}else{
			$scope.cuisine = new Cuisine;
			d.resolve(null);
		}
	};

}]);