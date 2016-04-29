'use strict';

angular.module('foodmashApp.directives')

.directive('versions', ['toaster', 'Version', '$q', '$location', function(toaster, Version, $q, $location){

	return {

		restrict: 'E',

		templateUrl: '/templates/versions.html',

		controller: ['$scope', 'toaster', 'Version', '$q', '$location', function($scope, toaster, Version, $q, $location){

			$scope.versions = [];
			$scope.version = new Version;
			$scope.loadingVersions = true;

			$scope.$watch('loadVersions', function(n, o){
				if(n){
					Version.query().then(function(versions){
						if(versions.length > 0){
						  $scope.versions = versions;		
						}else{
						  $scope.versions = new Array;
						}
						$scope.loadingVersions = false;
					}, function(err){
						$scope.versions = null;
						$scope.loadingVersions = false;
					});
				}
			});

			$scope.addVersion = function(){
				$scope.version.save().then(function(result){
					toaster.pop('success', 'A new Version was created!');
					$scope.versions.unshift($scope.version);
					$scope.version = new Version;
				}, function(err){
					toaster.pop('error', 'Failed to create new Version!');
				});
			};

		}]

	};

}]);