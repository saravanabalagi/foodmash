'use strict';

angular.module('foodmashApp.directives')

.directive('comboCard', ['toaster','CartService', function(toaster, CartService){

	return {

		restrict: 'E',

		templateUrl: '/templates/combo-card.html',

		controller: ['$scope', 'toaster','CartService', function($scope, toaster, CartService){

			$scope.selectedDishes = [];

			$scope.selectDish = function(combo, combo_option_id, dish_id){
				var selectedDish = {};
				selectedDish["combo_id"] = combo.id;
				selectedDish["combo_option_id"] = combo_option_id;
				selectedDish["dish_id"] = parseInt(dish_id, 10);
				selectedDish["added_at"] = Date.now();
				selectedDish["quantity"] = 1;
				checkAndPush(selectedDish)
			};

			$scope.addToCart = function(combo){
				pushAllComboDishes(combo);
				CartService.addToCart(combo, $scope.selectedDishes);
				toaster.pop('success' ,'Added to cart!');
			};

			$scope.checkComboSelection = function(combo){
				var l = 0;
				for(var i=0;i<$scope.selectedDishes.length; i++){
					if($scope.selectedDishes[i].combo_id == combo.id){
						l++;
					}
				}
				if(combo.combo_options){
					if(l == combo.combo_options.length){
						return false;
					}else{
						return true;
					}
				}else{
					return false;
				}
			};

			function checkAndPush(selectedDish){
				for(var i = 0; i<$scope.selectedDishes.length; i++){
					if(selectedDish.combo_id == $scope.selectedDishes[i].combo_id && selectedDish.combo_option_id == $scope.selectedDishes[i].combo_option_id){
						$scope.selectedDishes[i] = selectedDish;
						return ;
					}
				}
				$scope.selectedDishes.push(selectedDish);
			};

			function pushAllComboDishes(combo){
				if(combo.combo_dishes){
					for(var i=0; i<combo.combo_dishes.length; i++){
						var selectedDish = {};
						selectedDish["combo_id"] = combo.id;
						selectedDish["combo_dish_id"] = combo["combo_dishes"][i].id;
						selectedDish["dish_id"] = parseInt(combo["combo_dishes"][i].dish.id, 10);
						selectedDish["added_at"] = Date.now();
						selectedDish["quantity"] = 1;
						$scope.selectedDishes.push(selectedDish);
					}
				}
			};

		}]

	};

}]);