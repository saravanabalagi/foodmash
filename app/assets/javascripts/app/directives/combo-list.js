'use strict';

angular.module('foodmashApp.directives')

.directive('comboList', ['Combo', '$q', 'toaster', '$location', function(Combo, $q, toaster, $location){

	return {

		restrict: 'E',

		templateUrl: '/templates/combo-list.html',

		controller: ['$scope', 'Combo', '$q', 'toaster', '$location', function($scope, Combo, $q, toaster, $location){

			$scope.updatedCombo = new Combo;

			$scope.routeToCombo = function(combo){
				$location.path("/combos/" + combo.id);
			};

			$scope.updateActiveState = function(combo, active){
				var d = $q.defer();
				combo.update({active: active}).then(function(response){
					toaster.pop('success', 'Combo was updated!');
					var index = $scope.combos.indexOf(combo);
					if(angular.isNumber(index) && index >= 0){
						$scope.combos[index] = combo;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not updated!');
					combo.active = !combo.active;
					d.reject(err);
				});
				return d.promise;
			};

			$scope.setUpdate = function(combo){
				$scope.updatedCombo = angular.copy(combo);
			};

			$scope.updateCombo = function(combo, updateCross){
				var d = $q.defer();
				if(!updateCross){
					if(!$scope.comboUpdateForm.$pristine){
						$scope.updatedCombo.update().then(function(response){
							toaster.pop('success', 'Combo was updated!');
							var index = $scope.combos.indexOf(combo);
							if(angular.isNumber(index) && index >= 0){
								$scope.combos[index] = $scope.updatedCombo;
							}
							d.resolve(response);
						}, function(err){
							toaster.pop('error', 'Combo was not updated!');
							d.reject(err);
						});
					}else{
						$scope.updatedCombo = new Combo;
						d.resolve(null);
					}
				}
				return d.promise;
			};

			$scope.deleteCombo = function(combo){
				var d = $q.defer();
				combo.delete().then(function(response){
					toaster.pop('success', 'Combo was deleted!');
					$scope.combos.splice($scope.combos.indexOf(combo), 1);
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not deleted!');
					d.reject(err);
				});
			};

		}]

	};

}]);