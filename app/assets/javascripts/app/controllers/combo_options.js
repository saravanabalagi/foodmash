'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboOptionsController', ['$scope', 'ComboOption', '$q', 'toaster','DishType', function($scope, ComboOption, $q, toaster, DishType){

	$scope.dish_types = {};
	$scope.combo_options = {};
	$scope.combo_option = new ComboOption;

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

}]);