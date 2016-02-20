'use strict';

angular.module('foodmashApp.directives')

.directive('packagingCentres', ['toaster', 'PackagingCentre', '$q', '$location', function(toaster, PackagingCentre, $q, $location){

	return {

		restrict: 'E',

		templateUrl: '/templates/packaging-centres.html',

		controller: ['$scope', 'toaster', 'PackagingCentre', '$q', '$location', function($scope, toaster, PackagingCentre, $q, $location){

			$scope.packaging_centres = [];
			$scope.packaging_centre = new PackagingCentre;
			$scope.loadingPackagingCentres = true;

			PackagingCentre.query().then(function(packaging_centres){
				if(packaging_centres.length > 0){
				  $scope.packaging_centres = packaging_centres;		
				}else{
				  $scope.packaging_centres = new Array;
				}
				$scope.loadingPackagingCentres = false;
			}, function(err){
				$scope.packaging_centres = null;
				$scope.loadingPackagingCentres = false;
			});

			$scope.addPackagingCentre = function(){
				$scope.packaging_centre.save().then(function(result){
					toaster.pop('success', 'A new Packaging Centre was created!');
					$scope.packaging_centres.unshift($scope.packaging_centre);
					$scope.packaging_centre = new PackagingCentre;
				}, function(err){
					toaster.pop('error', 'Failed to create new Centre!');
				});
			};

		}]

	};

}]);