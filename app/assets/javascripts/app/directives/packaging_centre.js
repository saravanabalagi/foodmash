'use strict';

angular.module('foodmashApp.directives')

.directive('packagingCentre', ['toaster', 'PackagingCentre', '$q', '$location', function(toaster, PackagingCentre, $q, $location){

	return {

		restrict: 'E',

		templateUrl: '/templates/packaging_centre.html',

		controller: ['$scope', 'toaster', 'PackagingCentre', '$q', '$location', function($scope, toaster, PackagingCentre, $q, $location){

			$scope.updatedPackagingCentre = new PackagingCentre;

			$scope.setUpdate = function(packaging_centre){
				$scope.updatedPackagingCentre = angular.copy(packaging_centre);
			};

			$scope.updatePackagingCentre = function(packaging_centre, updateCross){
				var d = $q.defer();
				if(!updateCross){
					if(!$scope.updatePackagingCentreForm.$pristine){
						$scope.updatedPackagingCentre.update().then(function(response){
							toaster.pop('success', 'Packaging Centre was successfully updated!');
							var index = $scope.cities.indexOf(city);
							if(angular.isNumber(index) && index >= 0){
								$scope.packaging_centres[index] = $scope.updatedPackagingCentre;
							}
							d.resolve(response);
						}, function(err){
							toaster.pop('error', 'Packaging Centre was not updated!');
							d.reject(err);
						});
					}else{
						$scope.updatedPackagingCentre = new PackagingCentre;
						d.resolve(null);
					}
				 }
				return d.promise;
			};

			$scope.deletePackagingCentre = function(packaging_centre){
				var d = $q.defer();
				packaging_centre.delete().then(function(response){
					$scope.packaging_centres.splice($scope.packaging_centres.indexOf(packaging_centre), 1);
					toaster.pop('success', 'Packaging Centre was succussfully deleted!');
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Packaging Centre was not deleted!');
					d.reject(err);
				});
				return d.promise;
			};

		}]

	};

}]);