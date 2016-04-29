'use strict';

angular.module('foodmashApp.directives')

.directive('version', ['toaster', 'Version', '$q', '$location', function(toaster, Version, $q, $location){

	return {

		restrict: 'A',

		templateUrl: '/templates/version.html',

		controller: ['$scope', 'toaster', 'Version', '$q', '$location', function($scope, toaster, Version, $q, $location){

			$scope.updatedVersion = new Version;

			$scope.setUpdate = function(version){
				$scope.updatedVersion = angular.copy(version);
			};

			$scope.updateVersion = function(version){
				var d = $q.defer();
				$scope.updatedVersion.update().then(function(response){
					toaster.pop('success', 'Version was successfully updated!');
					var index = $scope.versions.indexOf(version);
					if(angular.isNumber(index) && index >= 0){
						$scope.versions[index] = $scope.updatedVersion;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Version was not updated!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.deleteVersion = function(version){
				var d = $q.defer();
				if(confirm('Are you sure ?')){
					version.delete().then(function(response){
						$scope.versions.splice($scope.versions.indexOf(version), 1);
						toaster.pop('success', 'Version was succussfully deleted!');
						d.resolve(response);
					}, function(err){
						toaster.pop('error', 'Version was not deleted!');
						d.reject(err);
					});
				}
				return d.promise;
			};

		}]

	};

}]);