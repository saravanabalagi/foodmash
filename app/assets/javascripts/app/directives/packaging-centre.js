'use strict';

angular.module('foodmashApp.directives')

.directive('packagingCentre', ['toaster', 'PackagingCentre', '$q', '$location', function(toaster, PackagingCentre, $q, $location){

	return {

		restrict: 'A',

		templateUrl: '/templates/packaging_centre.html',

		controller: ['$scope', 'toaster', 'PackagingCentre', '$q', '$location', function($scope, toaster, PackagingCentre, $q, $location){

			$scope.updatedPackagingCentre = new PackagingCentre;

			$scope.setUpdate = function(packaging_centre){
				$scope.updatedPackagingCentre = angular.copy(packaging_centre);
			};

			$scope.updatePackagingCentre = function(packaging_centre){
				var d = $q.defer();
				$scope.updatedPackagingCentre.update().then(function(response){
					toaster.pop('success', 'Centre was successfully updated!');
					var index = $scope.packaging_centres.indexOf(packaging_centre);
					if(angular.isNumber(index) && index >= 0){
						$scope.packaging_centres[index] = $scope.updatedPackagingCentre;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Centre was not updated!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.deletePackagingCentre = function(packaging_centre){
				var d = $q.defer();
				packaging_centre.delete().then(function(response){
					$scope.packaging_centres.splice($scope.packaging_centres.indexOf(packaging_centre), 1);
					toaster.pop('success', 'Centre was succussfully deleted!');
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Centre was not deleted!');
					d.reject(err);
				});
				return d.promise;
			};

		}]

	};

}]);