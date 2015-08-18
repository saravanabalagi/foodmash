'use strict';

angular.module('foodmashApp.controllers')

.controller('CombosController', ['$scope', 'toaster', 'Combo', '$q', '$location', function($scope, toaster, Combo, $q, $location){

	$scope.combo = new Combo;
	$scope.updatedCombo = new Combo;
	$scope.combos = {};

	Combo.query().then(function(combos){
		if(combos.length > 0){
			$scope.combos = combos;
		}else{
			$scope.combos = new Array;
		}
	}, function(err){
		$scope.combos = null;
	});

	$scope.routeToCombo = function(combo){
		$location.path("/combos/" + combo.id);
	};

	$scope.addCombo = function(addCross){
		var d = $q.defer();
		if(!addCross){
			if(!$scope.comboAddForm.$pristine){
				$scope.combo.save().then(function(response){
					toaster.pop('success', 'Combo was created!');
					$scope.combos.unshift($scope.combo);
					$scope.combo = new Combo;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not created!');
					d.reject(err);
				});
			}else{
				d.resolve(null);
			}
		}else{
			$scope.combo = new Combo;
			d.resolve(null);
		}
		return d.promise;
	};

	$scope.setUpdate = function(combo){
		$scope.updatedCombo = angular.copy(combo);
	};

	$scope.updateCombo = function(combo, updateCross){
		var d = $q.defer();
		if(!updateCross){
			$scope.updatedCombo.update().then(function(response){
				toaster.pop('success', 'Combo was updated!');
				var index = $scope.combos.indexOf(combo);
				if(angular.isNumber(index)){
					$scope.combos[index] = $scope.updatedCombo;
				}
				d.resolve(response);
			}, function(err){
				toaster.pop('error', 'Combo was not updated!');
				d.reject(err);
			});
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

}]);