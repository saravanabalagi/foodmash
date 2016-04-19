'use strict';

angular.module('foodmashApp.directives')

.directive('comboOption', ['ComboOption', '$q', 'toaster', function(ComboOption, $q, toaster){

	return {

		restrict: 'A',

		templateUrl: '/templates/combo-option.html',

		controller: ['$scope', 'ComboOption', '$q', 'toaster', function($scope, ComboOption, $q, toaster){

			$scope.updatedComboOption = new ComboOption;

			$scope.setUpdate = function(combo_option){
				$scope.updatedComboOption = angular.copy(combo_option);
				$scope.toggleCompulsoryOptionForUpdate.counter = $scope.updatedComboOption.compulsory == true ? 1 : 0;
			};

			$scope.toggleCompulsoryOptionForUpdate = function(){
				$scope.toggleCompulsoryOptionForUpdate.counter += 1;
				$scope.updatedComboOption.compulsory = $scope.compulsoryOptions[$scope.toggleCompulsoryOptionForUpdate.counter % 2].value;
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