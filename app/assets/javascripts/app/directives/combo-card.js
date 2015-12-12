'use strict';

angular.module('foodmashApp.directives')

.directive('comboCard', ['toaster','CartService', '$mdDialog', function(toaster, CartService, $mdDialog){

	return {

		restrict: 'E',

		templateUrl: '/templates/combo-card.html',

		controller: ['$scope', 'toaster','CartService', '$mdDialog', function($scope, toaster, CartService, $mdDialog){

			$scope.selectedDishes = [];
			$scope.filling = false;

			setQuantityForComboItems();
			setQuantityForCombo();

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
				setQuantityForCombo();
				toaster.pop('success' ,'Added to cart!');
			};

			$scope.addCombo = function(combo){
				pushAllComboDishes(combo);
				CartService.addToCart(combo, $scope.selectedDishes);
				setQuantityForCombo();
				toaster.pop('success', 'Added to cart!');
			};

			$scope.removeCombo = function(combo){
				CartService.removeFromCart(combo);
				if($scope.combo.quantity >= 1){
					$scope.combo.quantity -= 1;
				}
				toaster.pop('success', 'Deleted from cart!');
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
					if(l == combo.combo_options.length){
						return false;
					}else{
						return true;
					}
				}else{
					return false;
				}
			};

			$scope.showDescriptionDialog = function(ev){
			    $mdDialog.show({
			        controller: DialogController,
			        templateUrl: '/templates/combo-description.html',
			        parent: angular.element(document.body),
			        scope: $scope,
			        preserveScope: true,
			        targetEvent: ev,
			        clickOutsideToClose:true
			    });
			};

			function DialogController($scope, $mdDialog){
			    $scope.hide = function(){
			        $mdDialog.hide();
			    };

			    $scope.cancel = function(){
			        $mdDialog.cancel();
			    };
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