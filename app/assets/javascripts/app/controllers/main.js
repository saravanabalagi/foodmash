'use strict';

angular.module('foodmashApp.controllers')

.controller('MainController', ['$scope', 'CombosService','AuthService','$location','toaster' ,'CartService','Combo' ,'$q','Cart', function($scope, CombosService, AuthService, $location, toaster, CartService, Combo, $q, Cart){
	$scope.combos = {};
	$scope.selected = null;
	$scope.selectedDishes = [];

	CombosService.loadSideNavOptions().then(function(sideNavOptions){
		$scope.sideNavOptions = sideNavOptions;
		$scope.selected = sideNavOptions[0];
		$scope.selectOption(sideNavOptions[0]);
	});
	
	AuthService.currentUser().then(function(user){
		$scope.user = user;
	});

	$scope.$on('user:unset', function(event){
  		$scope.user = null;
   });

 	$scope.routeToRoot = function(){
 	 	$location.path("/");
 	};

 	$scope.routeToCart = function(){
 		$location.path("/cart");
 	};


	$scope.selectOption = function(option){
		$scope.selected = angular.isNumber(option)? $scope.sideNavOptions[option] : option;
		switch(option.name){
			case "Offers":
			$scope.offerCombos();
			break;
			case "Micro":
			$scope.microCombos();
			break;
			case "Medium":
			$scope.mediumCombos();
			break;
			case "Mega":
			$scope.megaCombos();
			break;
		}
	};

	$scope.offerCombos = function(){
		Combo.loadOfferCombos().then(function(offerCombos){
			$scope.combos = offerCombos;
		});
	};

	$scope.microCombos = function(){
		Combo.loadMicroCombos().then(function(microCombos){
			$scope.combos = microCombos;
		});
	};

	$scope.mediumCombos = function(){
		Combo.loadMediumCombos().then(function(mediumCombos){
			$scope.combos = mediumCombos;
		});
	};

	$scope.megaCombos = function(){
		Combo.loadMegaCombos().then(function(megaCombos){
			$scope.combos = megaCombos;
		});
	};

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
		for(var i=0; i<combo.combo_dishes.length; i++){
			var selectedDish = {};
			selectedDish["combo_id"] = combo.id;
			selectedDish["combo_dish_id"] = combo["combo_dishes"][i].id;
			selectedDish["dish_id"] = parseInt(combo["combo_dishes"][i].dish.id, 10);
			selectedDish["added_at"] = Date.now();
			selectedDish["quantity"] = 1;
			$scope.selectedDishes.push(selectedDish);
		}
	};

}]);