'use strict';

angular.module('foodmashApp.directives')

.directive('comboOptions', ['ComboOption', '$q', 'toaster', 'DishType', 'Dish', function(ComboOption, $q, toaster, DishType, Dish){

	return {

		restrict: 'A',

		templateUrl: '/templates/combo-options.html',

		controller: ['$scope', 'ComboOption', '$q', 'toaster', 'DishType', 'Dish', function($scope, ComboOption, $q, toaster, DishType, Dish){

			$scope.dish_types = [];
			$scope.combo_options = [];
			$scope.combo_option = new ComboOption;
			$scope.loadingDishesTypes = true;

			DishType.query({combo_id: $scope.combo.id}).then(function(dish_types){
				if(dish_types.length > 0){
					$scope.dish_types = dish_types;
				}else{
					$scope.dish_types = null;
				}
				$scope.loadingDishesTypes = false;
			}, function(err){
				$scope.dish_types = null;
			});

			$scope.$watch('combo', function(n, o){
				if(n.id){
					if($scope.combo.combo_options && $scope.combo.combo_options.length > 0){
						$scope.combo.combo_options.filter(function(co){
							$scope.combo_options.push(new ComboOption(co));
						});
					}else{
						$scope.combo_options = new Array;
					}
				}
			});

			$scope.selectDishTypeForComboOption = function(dish_type){
				$scope.selectedDishTypeForComboOption = dish_type;
				$scope.combo_option.dish_type_id = dish_type.id;
			};

			$scope.addComboOption = function(combo_id){
				var d = $q.defer();
				$scope.combo_option.combo_id = combo_id;
				$scope.combo_option.save().then(function(response){
					toaster.pop('success', 'Combo Option was created!');
					$scope.combo_options.unshift($scope.combo_option);
					$scope.combo_option = new ComboOption;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo Option was not created!');
					d.reject(null);
				});
				return d.promise;
			};

		}]

	};

}]);