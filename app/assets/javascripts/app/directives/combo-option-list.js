'use strict';

angular.module('foodmashApp.directives')

.directive('comboOptionList', ['ComboOption', '$q', 'toaster', '$location', 'DishType', function(ComboOption, $q, toaster, $location, DishType){

	return {

		restrict: 'E',

		templateUrl: '/templates/combo-option-list.html',

		controller: ['$scope', 'ComboOption', '$q', 'toaster', '$location', 'DishType', function($scope, ComboOption, $q, toaster, $location, DishType){

			$scope.updatedComboOption = new ComboOption;	
			$scope.dish_types = {};

			DishType.query().then(function(dish_types){
				if(dish_types.length > 0){
					$scope.dish_types = dish_types;
				}else{
					$scope.dish_types = null;
				}
			}, function(err){
				$scope.dish_types = null;
			});

			$scope.routeToComboOption = function(combo_option){
				$location.path("/combo_options/" + combo_option.id);
			};

			$scope.setUpdate = function(combo_option){
				$scope.updatedComboOption = angular.copy(combo_option);
			};

			$scope.updateComboOption = function(combo_option, comboOptionUpdateCross){
				var d = $q.defer();
				if(!comboOptionUpdateCross){
					if(!$scope.comboOptionUpdateForm.$pristine){
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

		}]

	};

}]);