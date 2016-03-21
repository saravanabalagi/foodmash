'use strict';

angular.module('foodmashApp.directives')

.directive('comboCard', ['toaster','CartService', '$location', 'ComboDescriptionService', function(toaster, CartService, $location, ComboDescriptionService){

	return {

		restrict: 'E',

		templateUrl: '/templates/combo-card.html',

		controller: ['$scope', 'toaster','CartService', '$location', 'ComboDescriptionService', function($scope, toaster, CartService, $location, ComboDescriptionService){

			$scope.selectedDishes = [];

			setQuantityForCombo();
			setQuantityForComboItems();
			pushDefaultComboOption($scope.combo);

			$scope.routeToComboDescription = function(combo){
				ComboDescriptionService.setComboForDescription(combo);
				$location.path("/combo-description");
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

			$scope.getLabelClass = function(label){
				var label_class = "";
				switch(label){
					case 'veg':
						label_class += ' veg';
						break;
					case 'egg': 
						label_class += ' egg';
						 break;
					case 'non-veg':
						label_class += ' non-veg';
						break;
				};
				return label_class;
			};

			function pushAllComboDishes(combo){
				if(combo.combo_dishes.length > 0){
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
				if(combo.combo_options.length > 0){
					for(var i=0; i<combo.combo_options.length; i++){
						var selectedDish = {"product": {}, "item": {}};
						selectedDish["product"]["id"] = combo.id;
						selectedDish["category_id"] = combo["combo_options"][i].id;
						selectedDish["category_type"] = "ComboOption";
						if(combo["combo_options"][i].combo_option_dishes.length > 0){
							selectedDish["item"]["id"] = parseInt(combo["combo_options"][i].combo_option_dishes[0].dish.id, 10);
							selectedDish["item"]["name"] = combo["combo_options"][i].combo_option_dishes[0].dish.name;
							selectedDish["item"]["description"] = combo["combo_options"][i].combo_option_dishes[0].dish.description;
							selectedDish["item"]["price"] = parseFloat(combo["combo_options"][i].combo_option_dishes[0].dish.price);
						}
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
						$scope.combo.combo_dishes[i].quantity = $scope.combo.combo_dishes[i].min_count;
					}
				}

				if($scope.combo.combo_options && $scope.combo.combo_options.length > 0){
					for(var i=0;i<$scope.combo.combo_options.length;i++){
						$scope.combo.combo_options[i].quantity = $scope.combo.combo_options[i].min_count;
					}
				}
			};

		}]

	};

}]);