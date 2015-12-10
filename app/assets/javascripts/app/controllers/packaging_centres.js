'use strict';

angular.module('foodmashApp.controllers')

.controller('PackagingCentresController', ['$scope','PackagingCentre','$q','toaster', function($scope, PackagingCentre, $q, toaster){
	
	$scope.packaging_centres = {};
	$scope.packaging_centre = new PackagingCentre;

	PackagingCentre.query().then(function(packaging_centres){
		if(packaging_centres.length > 0){
		  $scope.packaging_centres = packaging_centres;		
		}else{
		  $scope.packaging_centres = new Array;
		}
	}, function(err){
		$scope.packaging_centres = null;
	});

	$scope.addPackagingCentre = function(addCross){
		if(!addCross){
			if(!$scope.addPackagingCentreForm.$pristine){
				$scope.packaging_centre.save().then(function(result){
					toaster.pop('success', 'A new Packaging Centre was created!');
					$scope.packaging_centres.unshift($scope.packaging_centre);
					$scope.packaging_centre = new PackagingCentre;
				}, function(err){
					toaster.pop('error', 'Failed to create new Packaging Centre!');
				});
			}
		}else{
			$scope.packaging_centre = new PackagingCentre;
			d.resolve(null);
		}
	};

}]);