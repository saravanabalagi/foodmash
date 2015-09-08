'use strict';

angular.module('foodmashApp.controllers')

.controller('CombosController', ['$scope', 'toaster', 'Combo', '$q', function($scope, toaster, Combo, $q){

	$scope.combo = new Combo;
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