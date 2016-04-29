'use strict';

angular.module('foodmashApp.directives')

.directive('cuisines', ['toaster', 'Cuisine', '$q', function(toaster, Cuisine, $q){

	return {

		restrict: 'E',

		templateUrl: '/templates/cuisines.html',

		controller: ['$scope', 'toaster', 'Cuisine', '$q', function($scope, toaster, Cuisine, $q){

			$scope.cuisines = [];
			$scope.cuisine = new Cuisine;
			$scope.loadingCuisines = true;

			$scope.$watch('loadCuisines', function(n, o){
				if(n){
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
				}
			});

			$scope.addCuisine = function(){
				$scope.cuisine.save().then(function(result){
					toaster.pop('success', 'A new Cuisine was created!');
					$scope.cuisines.unshift($scope.cuisine);
					$scope.cuisine = new Cuisine;
				}, function(err){
					toaster.pop('error', 'Failed to create new Cuisine');
				});
			};

		}]

	};

}]);