'use strict';

angular.module('foodmashApp.directives')

.directive('comboOption', ['ComboOption', '$q', 'toaster', '$location', function(ComboOption, $q, toaster, $location){

	return {

		restrict: 'A',

		templateUrl: '/templates/combo-option.html',

		controller: ['$scope', 'ComboOption', '$q', 'toaster', '$location', function($scope, ComboOption, $q, toaster, $location){

			$scope.updatedComboOption = new ComboOption;

			$scope.setUpdate = function(combo_option){
				$scope.updatedComboOption = angular.copy(combo_option);
			};

			$scope.selectDishTypeForComboOptionUpdate = function(dish_type){
				$scope.selectedDishTypeForComboOptionUpdate = dish_type;
				$scope.updatedComboOption.dish_type_id = dish_type.id;
			};


			$scope.updateComboOption = function(combo_option){
				var d = $q.defer();
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