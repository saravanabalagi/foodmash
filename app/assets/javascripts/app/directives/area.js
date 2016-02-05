'use strict';

angular.module('foodmashApp.directives')

.directive('area', ['toaster', 'Areas', '$q', 'PackagingCentre', function(toaster, Areas, $q, PackagingCentre){

	return {

		restrict: 'E',

		templateUrl: '/templates/area.html',

		controller: ['$scope', 'toaster', 'Areas', '$q', 'PackagingCentre', function($scope, toaster, Areas, $q, PackagingCentre){

			$scope.updatedArea = new Areas;
			$scope.packaging_centres = [];

			PackagingCentre.query().then(function(packaging_centres){
				if(packaging_centres.length > 0){
					$scope.packaging_centres = packaging_centres;
				}else{
					$scope.packaging_centres = null;
				}
			}, function(err){
				$scope.packaging_centres = null;
			});

			$scope.setUpdate = function(area){
				$scope.updatedArea = angular.copy(area);
			};

			$scope.updateArea = function(area, updateCross){
				var d = $q.defer();
				if(!updateCross){
					if(!$scope.updateAreaForm.$pristine){
						$scope.updatedArea.update().then(function(response){
							toaster.pop('success', 'Area was successfully updated!');
							var index = $scope.areas.indexOf(area);
							if(angular.isNumber(index) && index >= 0){
								$scope.areas[index] = $scope.updatedArea;
							}
							d.resolve(response);
						}, function(err){
							toaster.pop('error', 'Area was not updated!');
							d.reject(err);
						});
					}else{
						$scope.updatedArea = new Areas;
						d.resolve(null);
					}
				 }
				return d.promise;
			};

			$scope.deleteArea = function(area){
				var d = $q.defer();
				area.delete().then(function(response){
					$scope.areas.splice($scope.areas.indexOf(area), 1);
					toaster.pop('success', 'Area was succussfully deleted!');
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Area was not deleted!');
					d.reject(err);
				});
				return d.promise;
			};

		}]

	};

}]);