'use strict';

angular.module('foodmashApp.directives')

.directive('areas', ['toaster', 'Areas', '$q', 'PackagingCentre', function(toaster, Areas, $q, PackagingCentre){

	return {

		restrict: 'A',

		templateUrl: '/templates/areas.html',

		controller: ['$scope', 'toaster', 'Areas', '$q', 'PackagingCentre', function($scope, toaster, Areas, $q, PackagingCentre){

			$scope.areas = [];
			$scope.area = new Areas;
			$scope.loadingPackagingCentres = true;

			$scope.$watch('city', function(n, o){
				if(n.id){
					if($scope.city.areas && $scope.city.areas.length > 0){
						$scope.city.areas.filter(function(ar){
							$scope.areas.push(new Areas(ar));
						});
					}else{
						$scope.areas = new Array;
					}
				}
			});

			PackagingCentre.query().then(function(packaging_centres){
				if(packaging_centres.length > 0){
					$scope.packaging_centres = packaging_centres;
				}else{
					$scope.packaging_centres = null;
				}
				$scope.loadingPackagingCentres = false;
			}, function(err){
				$scope.packaging_centres = null;
			});

			$scope.selectPackagingCentre = function(packaging_centre){
				$scope.selectedPackagingCentre = packaging_centre;
				$scope.area.packaging_centre_id = packaging_centre.id;
			};

			$scope.addArea = function(city_id){
				$scope.area.city_id = city_id;
				$scope.area.save().then(function(result){
					toaster.pop('success', 'A new Area was created!');
					$scope.areas.unshift($scope.area);
					var packaging_centre_id = $scope.area.packaging_centre_id;
					$scope.area = new Areas;
					renewSelectedValues(packaging_centre_id);
				}, function(err){
					toaster.pop('error', 'Failed to create new Area!');
				});
			};

			function renewSelectedValues(packaging_centre_id){
				$scope.area.packaging_centre_id = packaging_centre_id;
			};

		}]

	};

}]);