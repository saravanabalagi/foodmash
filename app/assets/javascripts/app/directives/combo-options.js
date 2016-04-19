'use strict';

angular.module('foodmashApp.directives')

.directive('comboOptions', ['ComboOption', '$q', 'toaster', 'Dish', 'ComboService', function(ComboOption, $q, toaster, Dish, ComboService){

	return {

		restrict: 'A',

		templateUrl: '/templates/combo-options.html',

		controller: ['$scope', 'ComboOption', '$q', 'toaster', 'Dish', 'ComboService', function($scope, ComboOption, $q, toaster, Dish, ComboService){

			$scope.combo_options = [];
			$scope.combo_option = new ComboOption;
			$scope.compulsoryOptions = 
			[
				{icon_class: "fa fa-times-circle", value: false},
				{icon_class: "fa fa-check-circle", value: true}
			];
			$scope.combo_option.compulsory = $scope.activeOptions[0].value;

			ComboService.getDishTypesForCombo().then(function(dish_types){
				$scope.dish_types = dish_types;
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

			$scope.toggleCompulsoryOption = function(){
				if(typeof($scope.toggleCompulsoryOption.counter) == 'undefined'){
					$scope.toggleCompulsoryOption.counter = 1;
				}else{
					$scope.toggleCompulsoryOption.counter += 1;
				}
				$scope.combo_option.compulsory = $scope.compulsoryOptions[$scope.toggleCompulsoryOption.counter % 2].value;
			};

			$scope.getIconForCompulsory = function(combo_option){
				var icon_class = "";
				$scope.compulsoryOptions.filter(function(compOp){
					if(compOp.value == combo_option.compulsory){
						icon_class = compOp.icon_class;
					}
				});
				return icon_class;
			};

			$scope.addComboOption = function(combo_id){
				var d = $q.defer();
				$scope.combo_option.combo_id = combo_id;
				$scope.combo_option.save().then(function(response){
					toaster.pop('success', 'Combo Option was created!');
					$scope.combo_options.unshift($scope.combo_option);
					var old_compulsory = $scope.combo_option.compulsory;
					$scope.combo_option = new ComboOption;
					renewSelectedValues(combo_id, old_compulsory);
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo Option was not created!');
					d.reject(null);
				});
				return d.promise;
			};

			function renewSelectedValues(combo_id, old_compulsory){
				$scope.combo_option.combo_id = combo_id;
				$scope.combo_option.compulsory = old_compulsory;
			};

		}]

	};

}]);