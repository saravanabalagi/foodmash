'use strict';

angular.module('foodmashApp.directives')

.directive('promos', ['toaster', 'Promo', '$q', '$location', function(toaster, Promo, $q, $location){

	return {

		restrict: 'E',

		templateUrl: '/templates/promos.html',

		controller: ['$scope', 'toaster', 'Promo', '$q', '$location', function($scope, toaster, Promo, $q, $location){

			$scope.promos = [];
			$scope.promo = new Promo;
			$scope.loadingPromos = true;

			$scope.$watch('loadPromos', function(n, o){
				if(n){
					Promo.query().then(function(promos){
						if(promos.length > 0){
						  $scope.promos = promos;		
						}else{
						  $scope.promos = new Array;
						}
						$scope.loadingPromos = false;
					}, function(err){
						$scope.promos = null;
						$scope.loadingPromos = false;
					});
				}
			});

			$scope.addPromo = function(){
				$scope.promo.save().then(function(result){
					toaster.pop('success', 'A new Promo was created!');
					$scope.promos.unshift($scope.promo);
					$scope.promo = new Promo;
				}, function(err){
					toaster.pop('error', 'Failed to create new Promo!');
				});
			};

		}]

	};

}]);