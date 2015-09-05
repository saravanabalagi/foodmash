'use strict';

angular.module('foodmashApp.controllers')

.controller('CuisinesController', ['$scope','Cuisine','$q','toaster', function($scope, Cuisine, $q, toaster){
	$scope.cuisines = {};
	$scope.cuisine = new Cuisine;
	$scope.updatedCuisine = new Cuisine;

	Cuisine.query().then(function(cuisines){
		if(cuisines.length > 0){
		  $scope.cuisines = cuisines;		
		}else{
		  $scope.cuisines = new Array;
		}
	}, function(err){
		$scope.cuisines = null;
	});

	$scope.setUpdate = function(cuisine){
		$scope.updatedCuisine = angular.copy(cuisine);
	};

	$scope.updateCuisine = function(cuisine, updateCross){
		var d = $q.defer();
		if(!updateCross){
			$scope.updatedCuisine.update().then(function(response){
				toaster.pop('success', 'Cuisine was successfully updated!');
				var index = $scope.cuisines.indexOf(cuisine);
				if(angular.isNumber(index)){
					$scope.cuisines[index] = $scope.updatedCuisine;
				}
				d.resolve(response);
			}, function(err){
				toaster.pop('error', 'Cuisine was not updated!');
				d.reject(err);
			});
		}
		return d.promise;
	};

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

	$scope.deleteCuisine= function(cuisine){
		var d = $q.defer();
		cuisine.delete().then(function(response){
			$scope.cuisines.splice($scope.cuisines.indexOf(cuisine), 1);
			toaster.pop('success', 'Cuisine was succussfully deleted!');
			d.resolve(response);
		}, function(err){
			toaster.pop('error', 'Cuisine was not deleted!');
			d.reject(err);
		});
		return d.promise;
	};

}]);