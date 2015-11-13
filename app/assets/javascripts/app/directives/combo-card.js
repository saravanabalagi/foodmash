'use strict';

angular.module('foodmashApp.directives')

.directive('comboCard', ['toaster','CartService', function(toaster, CartService){

	return {

		restrict: 'E',

		templateUrl: '/templates/combo-card.html',

		controller: ['$scope', 'toaster','CartService', function($scope, toaster, CartService){

			$scope.selectedDishes = [];
			$scope.filling = false;

			setQuantityForComboItems();

			$scope.selectDish = function(combo, combo_option, dish){
				var selectedDish = {"product": {}, "category": {}, "item": {}};
				selectedDish["product"]["id"] = combo.id;
				selectedDish["category_id"] = combo_option.id;
				selectedDish["category_type"] = "ComboOption";
				selectedDish["item"]["id"] = parseInt(dish_id, 10);
				selectedDish["item"]["name"] = dish.name;
				selectedDish["item"]["description"] = dish.description;
				selectedDish["item"]["price"] = parseFloat(dish.price);
				selectedDish["added_at"] = Date.now();
				selectedDish["quantity"] = combo_option.quantity;
				checkAndPush(selectedDish)
			};

			$scope.addToCart = function(combo){
				pushAllComboDishes(combo);
				CartService.addToCart(combo, $scope.selectedDishes);
				toaster.pop('success' ,'Added to cart!');
			};

			$scope.validateQuantity = function(combo_item){
				if(combo_item.quantity >= 1 && combo_item.quantity <=50){
					$scope.filling = false;
				}else if(combo_item.quantity === null){
					$scope.filling = true;
				}else if(combo_item.quantity === undefined){
					combo_item.quantity = 1;
					$scope.filling = false;
				}
			};

			$scope.checkComboSelection = function(combo){
				var l = 0;
				for(var i=0;i<$scope.selectedDishes.length; i++){
					if($scope.selectedDishes[i]["product"]["id"] == combo.id){
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
					if(selectedDish["product"].id == $scope.selectedDishes[i]["product"].id && selectedDish["category"].id == $scope.selectedDishes[i]["category"].id && selectedDish["category"].type == $scope.selectedDishes[i]["category"].type){
						$scope.selectedDishes[i] = selectedDish;
						return ;
					}
				}
				$scope.selectedDishes.push(selectedDish);
			};

			function pushAllComboDishes(combo){
				if(combo.combo_dishes){
					for(var i=0; i<combo.combo_dishes.length; i++){
						var selectedDish = {"product": {}, "category": {}, "item": {}};
						selectedDish["product"]["id"] = combo.id;
						selectedDish["category_id"] = combo["combo_dishes"][i].id;
						selectedDish["category_type"] = "ComboDish";
						selectedDish["item"]["id"] = parseInt(combo["combo_dishes"][i].dish.id, 10);
						selectedDish["item"]["name"] = combo["combo_dishes"][i].dish.name;
						selectedDish["item"]["description"] = combo["combo_dishes"][i].dish.description;
						selectedDish["item"]["price"] = parseFloat(combo["combo_dishes"][i].dish.price);
						selectedDish["added_at"] = Date.now();
						selectedDish["quantity"] = combo["combo_dishes"][i].quantity;
						$scope.selectedDishes.push(selectedDish);
					}
				}
			};

			function setQuantityForComboItems(){
				if($scope.combo.combo_dishes && $scope.combo.combo_dishes.length > 0){
					for(var i=0;i<$scope.combo.combo_dishes.length;i++){
						$scope.combo.combo_dishes[i].quantity = 1;
					}
				}

					if($scope.combo.combo_options && $scope.combo.combo_options.length > 0){
					for(var i=0;i<$scope.combo.combo_options.length;i++){
						$scope.combo.combo_options[i].quantity = 1;
					}
				}
			};

		}]

	};

}]);