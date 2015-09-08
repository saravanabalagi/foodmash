'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboController', ['$scope', 'Combo', '$location', '$routeParams', 'toaster', '$q','$timeout', function($scope, Combo, $location, $routeParams, toaster, $q, $timeout){

	$scope.combo = {};
	$scope.combo_options = {};
	$scope.updatedCombo = new Combo;

	$scope.$on('$viewContentLoaded', function() {
    $timeout(function() {
    	    angular.element(document.querySelector('#load-combo-options')).triggerHandler('click');
    	}, 1000);
	});

	$scope.$on('$viewContentLoaded', function() {
    $timeout(function() {
    	    angular.element(document.querySelector('#load-combo-dishes')).triggerHandler('click');
    	}, 1000);
	});

	Combo.query({id: $routeParams.id}).then(function(combos){
		if(combos.length > 0){
			$scope.combo = combos[0];
		}else{
			$scope.combo = null;
		}
	});

	$scope.setUpdate = function(combo){
		$scope.updatedCombo = angular.copy(combo);
	};

	$scope.updateCombo = function(updateCross){
		var d = $q.defer();
		if(!updateCross){
			if(!$scope.comboUpdateForm.$pristine){
				$scope.updatedCombo.update().then(function(response){
					toaster.pop('success', 'Combo was updated!');
					$scope.combo = $scope.updatedCombo;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not updated!');
					d.reject(err);
				});
			}else{
				d.resolve(null);
			}
		}
	};

	$scope.deleteCombo = function(){
		var d = $q.defer();
		$scope.combo.delete().then(function(response){
			toaster.pop('success', 'Combo was deleted!');
			$location.path('/combos');
		}, function(err){
			toaster.pop('error', 'Combo was not deleted!');
			d.reject(err);
		});
	};

}]);