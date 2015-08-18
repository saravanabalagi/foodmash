'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboOptionsController', ['$scope', 'ComboOption', '$location', '$q', 'toaster','DishType', function($scope, ComboOption, $location, $q, toaster, DishType){

	$scope.dish_types = {};
	$scope.combo_options = {};
	$scope.combo_option = new ComboOption;
	$scope.updatedComboOption = new ComboOption;	

	DishType.query().then(function(dish_types){
		if(dish_types.length > 0){
			$scope.dish_types = dish_types;
		}else{
			$scope.dish_types = null;
		}
	}, function(err){
		$scope.dish_types = null;
	});

	$scope.loadComboOptions = function(combo_id){
		var d = $q.defer();
		ComboOption.query({combo_id: combo_id}).then(function(combo_options){
			if(combo_options.length > 0){
				$scope.combo_options = combo_options;
				console.log(combo_options);
			}else{
				$scope.combo_options = new Array;
			}
			d.resolve(combo_options);
		}, function(err){
			$scope.combo_options = null;
			d.reject(err);
		});
		return d.promise;
	};

	$scope.addComboOption = function(comboOptionsAddCross, combo_id){
		var d = $q.defer();
		$scope.combo_option.combo_id = combo_id;
		if(!comboOptionsAddCross){
			if(!$scope.comboOptionAddForm.$pristine){
				$scope.combo_option.save().then(function(response){
					toaster.pop('success', 'Combo Option was created!');
					$scope.combo_options.unshift($scope.combo_option);
					$scope.combo_option = new ComboOption;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo Option was not created!');
					d.reject(null);
				});
			}else{
				d.resolve(null);
			}
		}else{
			$scope.combo_option = new ComboOption;
			d.resolve(null);
		}
		return d.promise;
	};

	$scope.setUpdate = function(combo_option){
		$scope.updatedComboOption = angular.copy(combo_option);
	};

	$scope.updateComboOption = function(combo_option, comboOptionUpdateCross){
		var d = $q.defer();
		if(!comboOptionUpdateCross){
			$scope.updatedComboOption.update().then(function(response){
				toaster.pop('success', 'Combo Option was updated!');
				var index = $scope.combo_options.indexOf(combo_option);
				if(angular.isNumber(index)){
					$scope.combo_options[index] = $scope.updatedComboOption;
				}
				d.resolve(response);
			}, function(err){
				toaster.pop('Combo Option was not updated!');
				d.reject(err);
			});
		}else{
			$scope.updatedComboOption = new ComboOption;
			d.resolve(null);
		}
		return d.promise;
	};

	$scope.deleteComboOption = function(combo_option){
		var d = $q.defer();
		combo_option.delete().then(function(response){
			toaster.pop('success', 'Combo Option was deleted!');
			$scope.combo_options.splice($scope.combo_options.indexOf(combo_option), 1);
			d.resolve(response);
		}, function(err){
			toaster.pop('error', 'Combo Option was not deleted!');
			d.reject(err);
		});
		return d.promise;
	};

}]);