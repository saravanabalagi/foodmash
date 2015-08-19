'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboController', ['$scope', 'Combo', '$location', '$routeParams', 'toaster', '$q', function($scope, Combo, $location, $routeParams, toaster, $q){

	$scope.combo = {};
	$scope.combo_options = {};
	$scope.updatedCombo = new Combo;

	Combo.query({id: $routeParams.id}).then(function(combos){
		if(combos.length > 0){
			$scope.combo = combos[0];
		}else{
			$scope.combo = null;
		}
	});

	$scope.routeToComboOption = function(combo_option){
		$location.path("/combo_options/" + combo_option.id);
	};

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