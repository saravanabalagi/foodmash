'use strict';

angular.module('foodmashApp.controllers')

.controller('AreasController', ['$scope', 'Areas', '$q', 'toaster', '$routeParams', function($scope, Areas, $q, toaster, $routeParams){

	$scope.areas = {};
	$scope.area = new Areas;

	Areas.query({city_id: $routeParams.id}).then(function(areas){
		if(areas.length > 0){
		  $scope.areas = areas;		
		}else{
		  $scope.areas = new Array;
		}
	}, function(err){
		$scope.areas = null;
	});

	$scope.addArea = function(addCross){
		if(!addCross){
			if(!$scope.addAreaForm.$pristine){
				$scope.area.city_id = $routeParams.id;
				$scope.area.save().then(function(result){
					toaster.pop('success', 'A new Area was created!');
					$scope.areas.unshift($scope.area);
					$scope.area = new Areas;
				}, function(err){
					toaster.pop('error', 'Failed to create new Area!');
				});
			}
		}else{
			$scope.area = new Areas;
			d.resolve(null);
		}
	};

}]);