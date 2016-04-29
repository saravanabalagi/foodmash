'use strict';

angular.module('foodmashApp.directives')

.directive('promo', ['toaster', 'Promo', '$q', '$location', function(toaster, Promo, $q, $location){

	return {

		restrict: 'A',

		templateUrl: '/templates/promo.html',

		controller: ['$scope', 'toaster', 'Promo', '$q', '$location', function($scope, toaster, Promo, $q, $location){

			$scope.updatedPromo = new Promo;

			$scope.setUpdate = function(promo){
				$scope.updatedPromo = angular.copy(promo);
			};

			$scope.updatePromo = function(promo){
				var d = $q.defer();
				$scope.updatedPromo.update().then(function(response){
					toaster.pop('success', 'Promo was successfully updated!');
					var index = $scope.promos.indexOf(promo);
					if(angular.isNumber(index) && index >= 0){
						$scope.promos[index] = $scope.updatedPromo;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Promo was not updated!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.deletePromo = function(promo){
				var d = $q.defer();
				if(confirm('Are you sure ?')){
					promo.delete().then(function(response){
						$scope.promos.splice($scope.promos.indexOf(promo), 1);
						toaster.pop('success', 'Promo was succussfully deleted!');
						d.resolve(response);
					}, function(err){
						toaster.pop('error', 'Promo was not deleted!');
						d.reject(err);
					});
				}
				return d.promise;
			};

		}]

	};

}]);