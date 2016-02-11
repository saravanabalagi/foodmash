'use strict';

angular.module('foodmashApp.directives')

.directive('comboCard', ['toaster','CartService', '$location', 'ComboService', function(toaster, CartService, $location, ComboService){

	return {

		restrict: 'E',

		templateUrl: '/templates/combo-card.html',

		controller: ['$scope', 'toaster','CartService', '$location', 'ComboService', function($scope, toaster, CartService, $location, ComboService){

			$scope.selectedDishes = [];
			$scope.filling = false;

			setQuantityForCombo();
			setQuantityForComboItems();
			pushDefaultComboOption($scope.combo);

			$scope.routeToComboDescription = function(combo){
				ComboService.setComboForDescription(combo);
				$location.path("/combo-description");
			};

			$scope.selectDish = function(combo, combo_option, dish){
				var selectedDish = {"product": {}, "item": {}};
				selectedDish["product"]["id"] = combo.id;
				selectedDish["category_id"] = combo_option.id;
				selectedDish["category_type"] = "ComboOption";
				selectedDish["item"]["id"] = parseInt(dish.id, 10);
				selectedDish["item"]["name"] = dish.name;
				selectedDish["item"]["description"] = dish.description;
				selectedDish["item"]["price"] = parseFloat(dish.price);
				selectedDish["added_at"] = Date.now();
				selectedDish["quantity"] = 1;
				checkAndPush(selectedDish)
			};

			$scope.removeSelectedDish = function(combo_option, combo_option_dish){
				if($scope.checkIfSelected(combo_option, combo_option_dish)){
					for(var i=0; i<$scope.selectedDishes.length; i++){
						if(combo_option.id == $scope.selectedDishes[i]["category_id"] && combo_option_dish.dish.id == $scope.selectedDishes[i]["item"]["id"]){
							$scope.selectedDishes[i]["quantity"] -= 1;
							if($scope.selectedDishes[i]["quantity"] == 0){
								$scope.selectedDishes.splice(i, 1);
							}
						}
					}
				}
			};

			$scope.toggleDish = function(combo, combo_option, combo_option_dish){
				if($scope.checkIfSelected(combo_option, combo_option_dish)){
					for(var i=0; i<$scope.selectedDishes.length; i++){
						if(combo_option.id == $scope.selectedDishes[i]["category_id"] && combo_option_dish.dish.id == $scope.selectedDishes[i]["item"]["id"]){
							$scope.selectedDishes.splice(i, 1);
						}
					}
				}else{
					$scope.selectDish(combo, combo_option, combo_option_dish.dish);
				}
			};

			$scope.checkIfSelected = function(combo_option, combo_option_dish){
				for(var i=0; i<$scope.selectedDishes.length; i++){
					if(combo_option.id == $scope.selectedDishes[i]["category_id"] && combo_option_dish.dish.id == $scope.selectedDishes[i]["item"]["id"]){
						return true;
					}
				}
				return false;
			};

			$scope.showQuantityOfSelectedDish = function(combo_option, combo_option_dish){
				for(var i=0; i<$scope.selectedDishes.length; i++){
					if(combo_option.id == $scope.selectedDishes[i]["category_id"] && combo_option_dish.dish.id == $scope.selectedDishes[i]["item"]["id"]){
						return $scope.selectedDishes[i]["quantity"];
					}
				}
				return 0;
			};

			$scope.addCombo = function(combo){
				pushAllComboDishes(combo);
				CartService.addToCart(combo, $scope.selectedDishes);
				$scope.selectedDishes = [];
				setQuantityForCombo();
				setQuantityForComboItems();
				pushDefaultComboOption($scope.combo);
				toaster.pop('success', 'Added to cart!');
			};

			$scope.removeCombo = function(combo){
				CartService.removeFromCart(combo);
				if($scope.combo.quantity >= 1){
					$scope.combo.quantity -= 1;
				}
				toaster.pop('success', 'Removed from cart!');
			};

			$scope.addComboDish = function(combo_dish){
				$scope.combo.combo_dishes.filter(function(cdish){
					if(cdish.id == combo_dish.id){
						cdish.quantity += 1;
					}
				});
			};

			$scope.removeComboDish = function(combo_dish){
				$scope.combo.combo_dishes.filter(function(cdish){
					if(cdish.id == combo_dish.id && cdish.quantity >= 1){
						cdish.quantity -= 1;
					}
				});
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
					if(l >= combo.combo_options.length){
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
					if(selectedDish["product"]["id"] == $scope.selectedDishes[i]["product"]["id"] && selectedDish["category_id"] == $scope.selectedDishes[i]["category_id"] && selectedDish["category_type"] == $scope.selectedDishes[i]["category_type"] && selectedDish["item"]["id"] == $scope.selectedDishes[i]["item"]["id"]){
						$scope.selectedDishes[i]["quantity"] += 1;
						return ;
					}
				}
				$scope.selectedDishes.push(selectedDish);
			};

			function pushAllComboDishes(combo){
				if(combo.combo_dishes){
					for(var i=0; i<combo.combo_dishes.length; i++){
						var selectedDish = {"product": {}, "item": {}};
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

			function pushDefaultComboOption(combo){
				if(combo.combo_options){
					for(var i=0; i<combo.combo_options.length; i++){
						var selectedDish = {"product": {}, "item": {}};
						selectedDish["product"]["id"] = combo.id;
						selectedDish["category_id"] = combo["combo_options"][i].id;
						selectedDish["category_type"] = "ComboOption";
						selectedDish["item"]["id"] = parseInt(combo["combo_options"][i].combo_option_dishes[0].dish.id, 10);
						selectedDish["item"]["name"] = combo["combo_options"][i].combo_option_dishes[0].dish.name;
						selectedDish["item"]["description"] = combo["combo_options"][i].combo_option_dishes[0].dish.description;
						selectedDish["item"]["price"] = parseFloat(combo["combo_options"][i].combo_option_dishes[0].dish.price);
						selectedDish["added_at"] = Date.now();
						selectedDish["quantity"] = combo["combo_options"][i].quantity;
						$scope.selectedDishes.push(selectedDish);
					}
				}
			};

			function setQuantityForCombo(){
				CartService.getCartInfo().then(function(cart){
					if($scope.combo){
						$scope.combo.quantity = 0;
						cart.orders.filter(function(order){
							if(order.product.id == $scope.combo.id){
								$scope.combo.quantity += order.quantity;
							}
						});
					}
				});
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