'use strict';

angular.module('foodmashApp.controllers')

.controller('CombosController', ['$scope', 'toaster', 'Combo', '$q','PackagingCentre', function($scope, toaster, Combo, $q, PackagingCentre){

	$scope.combo = new Combo;
	$scope.combos = {};
	$scope.categories = [{name: 'regular'}, {name: 'budget'}, {name: 'corporate'}, {name: 'health'}];
	$scope.loadingCombos = true;

	Combo.query().then(function(combos){
		if(combos.length > 0){
			$scope.combos = combos;
		}else{
			$scope.combos = new Array;
		}
		$scope.loadingCombos = false;
	}, function(err){
		$scope.combos = null;
		$scope.loadingCombos = false;
	});

	PackagingCentre.query().then(function(packaging_centres){
		if(packaging_centres.length > 0){
			$scope.packaging_centres = packaging_centres;
		}else{
			$scope.packaging_centres = null;
		}
	}, function(err){
		$scope.packaging_centres = null;
	});

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

}]);