'use strict';

angular.module('foodmashApp.directives')

.directive('cuisine', ['toaster', 'Cuisine', '$q', function(toaster, Cuisine, $q){

	return {

		restrict: 'A',

		templateUrl: '/templates/cuisine.html',

		controller: ['$scope', 'toaster', 'Cuisine', '$q', function($scope, toaster, Cuisine, $q){

			$scope.updatedCuisine = new Cuisine;

			$scope.setUpdate = function(cuisine){
				$scope.updatedCuisine = angular.copy(cuisine);
			};

			$scope.updateCuisine = function(cuisine, updateCross){
				var d = $q.defer();
				$scope.updatedCuisine.update().then(function(response){
					toaster.pop('success', 'Cuisine was successfully updated!');
					var index = $scope.cuisines.indexOf(cuisine);
					if(angular.isNumber(index) && index >= 0){
						$scope.cuisines[index] = $scope.updatedCuisine;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Cuisine was not updated!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.deleteCuisine= function(cuisine){
				var d = $q.defer();
				if(confirm('Are you sure ?')){
					cuisine.delete().then(function(response){
						$scope.cuisines.splice($scope.cuisines.indexOf(cuisine), 1);
						toaster.pop('success', 'Cuisine was succussfully deleted!');
						d.resolve(response);
					}, function(err){
						toaster.pop('error', 'Cuisine was not deleted!');
						d.reject(err);
					});
				}
				return d.promise;
			};

		}]

	};

}]);