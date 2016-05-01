'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboDescriptionController', ['$scope', '$location', 'toaster', 'CartService', 'ComboDescriptionService', '$filter', function($scope, $location, toaster, CartService, ComboDescriptionService, $filter){

	$scope.selectedDishes = [];
	$scope.combo = {};
	$scope.selectedComboOption = null;

	$scope.routeToRoot = function(){
		$location.path("/");
	};

	$scope.load = function(){
		angular.element(document).ready(function (){
			$(function(){
                $(".thumbnail.combo-option > .img-wrapper").each(function() { $(this).height($(this).width()*0.75); });
                $(".thumbnail.combo-dish .img-wrapper > img, .thumbnail.combo-option .img-wrapper > img").each(function() {
                    if($(this).width()!=0
                        && $(this).height()!=0
                        && $(this).height()>$(this).width()*0.75) {
                        $(this).css("height","auto");
                        $(this).css("width","100%");
                    }
                });
                $(".thumbnail.combo-dish .img-wrapper > img, .thumbnail.combo-option .img-wrapper > img").load(function() {
                if($(this).height()>$(this).width()*0.75) {
                   $(this).css("width","100%");
                   $(this).css("height","auto");
                }
                });
                $('.thumbnail img').matchHeight();
			});
		});
	};

	ComboDescriptionService.getComboForDescription().then(function(combo){
		$scope.combo = combo;
		var orderBy = $filter('orderBy');
		orderBy($scope.combo.combo_options, 'priority', true);
		$scope.selectComboOption($scope.combo.combo_options[0]);
		$scope.load();
	  	setQuantityForComboItems();
	}, function(err){
		$scope.combo = null;
	});

	$scope.selectComboOption = function(combo_option){
		$scope.selectedComboOption = combo_option;
		$scope.load();
	};

	$scope.checkIfComboOptionSelected = function(combo_option){
		var check = false;
		if(combo_option && combo_option.id && $scope.selectedComboOption && $scope.selectedComboOption.id && combo_option.id == $scope.selectedComboOption.id && combo_option.name == $scope.selectedComboOption.name){
			check = true;
		}
		return check;
	};

	$scope.selectDish = function(combo, combo_option, dish){
		var selectedDish = {"product": {}, "item": {}};
		selectedDish["product"]["id"] = combo.id;
		selectedDish["category_id"] = combo_option.id;
		selectedDish["category_type"] = "ComboOption";
		selectedDish["item"]["id"] = parseInt(dish.id, 10);
		selectedDish["item"]["name"] = dish.name;
		selectedDish["item"]["price"] = parseFloat(dish.price);
		selectedDish["item"]["dish_type_id"] = dish.dish_type_id;
		selectedDish["added_at"] = Date.now();
		selectedDish["quantity"] = 1;
		checkAndPush(selectedDish)
	};

	$scope.removeSelectedDish = function(combo_option, combo_option_dish){
		if($scope.checkIfSelected(combo_option, combo_option_dish)){
			for(var i=0; i<$scope.selectedDishes.length; i++){
				if(combo_option.id == $scope.selectedDishes[i]["category_id"] && combo_option_dish.dish.id == $scope.selectedDishes[i]["item"]["id"]){
					$scope.selectedDishes[i]["quantity"] -= 1;
					if($scope.selectedDishes[i]["quantity"] == 0 && checkAndRemove($scope.combo, combo_option)){
						$scope.selectedDishes.splice(i, 1);
					}else{
						if($scope.selectedDishes[i]["quantity"] == 0 && !checkAndRemove($scope.combo, combo_option)){
							$scope.selectedDishes[i]["quantity"] = 1;
						}else if(!checkAndRemove($scope.combo, combo_option)){
							$scope.selectedDishes[i]["quantity"] += 1;
						}
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
		if(checkForNonCompulsoryComboOptions(combo)){
			pushAllComboDishes(combo);
			CartService.addToCart(combo, $scope.selectedDishes);
			$scope.selectedDishes = [];
			setQuantityForComboItems();
			pushDefaultComboOption($scope.combo);
			toaster.pop('success', 'Added to cart!');
		}else{
			toaster.pop('error', 'Please select one more dish from another tab!');
		}
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
			if(cdish.id == combo_dish.id && cdish.quantity > cdish.min_count){
				cdish.quantity -= 1;
			}
		});
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

	function checkForNonCompulsoryComboOptions(combo){
		var presence = false;
		$scope.selectedDishes.filter(function(selectedDish){
			combo.combo_options.filter(function(combo_option){
				if(combo_option.id == selectedDish.category_id && !combo_option.min_count){
					presence = true;
				}
			});
		});
		return presence;
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

	function checkAndRemove(combo, combo_option){
		var count = 0;
		$scope.selectedDishes.filter(function(selectedDish){
			if(selectedDish["product"]["id"] == combo.id && selectedDish["category_id"] == combo_option.id){
				count += selectedDish["quantity"];
			}
		});
		if(!combo_option.min_count){
			return true;
		}
		if(count == combo_option.min_count - 1){
			return false;
		}else if(count >= combo_option.min_count){
			return true;
		}
		return false;
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
				selectedDish["item"]["price"] = parseFloat(combo["combo_dishes"][i].dish.price);
				selectedDish["item"]["dish_type_id"] = dish.dish_type_id;
				selectedDish["added_at"] = Date.now();
				selectedDish["quantity"] = combo["combo_dishes"][i].quantity;
				$scope.selectedDishes.push(selectedDish);
			}
		}
	};

	function pushDefaultComboOption(combo){
		if(combo.combo_options.length > 0){
			for(var i=0; i<combo.combo_options.length; i++){
				if(combo.combo_options[i].min_count){
					var selectedDish = {"product": {}, "item": {}};
					selectedDish["product"]["id"] = combo.id;
					selectedDish["category_id"] = combo["combo_options"][i].id;
					selectedDish["category_type"] = "ComboOption";
					if(combo["combo_options"][i].combo_option_dishes.length > 0){
						var lowest_combo_option_dish = combo["combo_options"][i].combo_option_dishes[0];
						for(var j=1;j<combo["combo_options"][i].combo_option_dishes.length;j++){
							if(lowest_combo_option_dish.dish.price > combo["combo_options"][i].combo_option_dishes[j].dish.price){
								lowest_combo_option_dish = combo["combo_options"][i].combo_option_dishes[j];
							}
						}
						selectedDish["item"]["id"] = parseInt(lowest_combo_option_dish.dish.id, 10);
						selectedDish["item"]["name"] = lowest_combo_option_dish.dish.name;
						selectedDish["item"]["price"] = parseFloat(lowest_combo_option_dish.dish.price);
						selectedDish["item"]["dish_type_id"] = lowest_combo_option_dish.dish.dish_type_id;
					}
					selectedDish["added_at"] = Date.now();
					selectedDish["quantity"] = combo["combo_options"][i].quantity;
					$scope.selectedDishes.push(selectedDish);
				}
			}
		}
	};

	function setQuantityForComboItems(){
		if($scope.combo.combo_dishes && $scope.combo.combo_dishes.length > 0){
			for(var i=0;i<$scope.combo.combo_dishes.length;i++){
				$scope.combo.combo_dishes[i].quantity = $scope.combo.combo_dishes[i].min_count;
			}
		}

		if($scope.combo.combo_options && $scope.combo.combo_options.length > 0){
			for(var i=0;i<$scope.combo.combo_options.length;i++){
				if($scope.combo.combo_options[i].min_count){
					$scope.combo.combo_options[i].quantity = $scope.combo.combo_options[i].min_count;
				}
			}
		}
	};

}]);

