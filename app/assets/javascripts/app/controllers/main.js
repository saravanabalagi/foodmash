'use strict';

angular.module('foodmashApp.controllers')

.controller('MainController', ['$scope', 'CombosService', 'AuthService', '$location', 'toaster', '$q', 'Combo', '$rootScope', 'CartService', function($scope, CombosService, AuthService, $location, toaster, $q, Combo, $rootScope, CartService){
		$scope.combos = {};
		$scope.selected = [];
		$scope.loadingComboCards = true;

		CartService.setCartGlobally();

		$scope.mainOptions = 
		[
			{name: "All", icon_class: "fa fa-hashtag pull-right"},
			{name: "Budget", icon_class: "fa fa-coffee pull-right"},
			{name: "Corporate", icon_class: "fa fa-sitemap pull-right"},
			{name: "Health", icon_class: "fa fa-heartbeat pull-right"}
		];
		$scope.sizeOptions = 
		[
		   {name: "Micro", icon_class: "icon-user1 pull-right", style: ""},
		   {name: "Medium", icon_class: "icon-user2 pull-right", style: "font-size: 18px; margin-top: -3px;"},
		   {name: "Mega", icon_class: "icon-user3 pull-right", style: "font-size: 25px; padding: 0; margin-top: -5px;"}
		];
		$scope.preferenceOptions = 
		[
			{name: "Veg", icon_class: "fa fa-leaf pull-right"},
			{name: "Egg", icon_class: "icon-egg pull-right"},
			{name: "Non Veg", icon_class: "icon-meat pull-right"}
		];

		$scope.logo_transparent = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/logo_transparent.png';
		
		Combo.loadFromPackagingCentre().then(function(loadedFromPackagingCentre){
			$scope.combos = loadedFromPackagingCentre;
			$scope.loadingComboCards = false;
		}, function(err){
			$scope.combos = null;
			$scope.loadingComboCards = false;
		});

		AuthService.currentUser().then(function(user){
			$scope.user = user;
		});

		$scope.$on('user:unset', function(event){
	  		$scope.user = null;
	   });

		$scope.routeToCart = function(){
			$location.path("/cart");
		};

	 	$scope.routeToRoot = function(){
	 	 	$location.path("/");
	 	};


	 	$scope.checkIfMainOptionSelected = function(option){
	 		for(var i=0;i<$scope.selected.length; i++){
				if($scope.selected[i] == option){
					return true;
				}
			}
	 		return false;
	 	};

	 	$scope.selectMainOption = function(option){
	 		if($scope.checkIfMainOptionSelected(option)){
	 			$scope.selected.splice($scope.selected.indexOf(option), 1);	
	 		}else{
	 			$scope.selected.push(option);
	 		}
	 		$scope.loadingComboCards = true;
	 		$scope.combos = {};
	 		switch(option.name){
	 			case "All":
	 			break;
	 			case "Budget":
	 			break;
	 			case "Corporate":
	 			break;
	 			case "Health":
	 			break;
	 		}
	 	};

	 	$scope.checkIfSizeOptionSelected = function(option){
			for(var i=0;i<$scope.selected.length; i++){
				if($scope.selected[i] == option){
					return true;
				}
			}
	 		return false;
	 	};

		$scope.selectSizeOption = function(option){
			if($scope.checkIfSizeOptionSelected(option)){
				$scope.selected.splice($scope.selected.indexOf(option), 1);	
			}else{
				$scope.selected.push(option);
			}
			$scope.loadingComboCards = true;
			$scope.combos = {};
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

	 	$scope.checkIfPreferenceOptionSelected = function(option){
	 		for(var i=0;i<$scope.selected.length; i++){
				if($scope.selected[i] == option){
					return true;
				}
			}
	 		return false;
	 	};

	 	$scope.selectPreferenceOption = function(option){
	 		if($scope.checkIfPreferenceOptionSelected(option)){
	 			$scope.selected.splice($scope.selected.indexOf(option), 1);	
	 		}else{
	 			$scope.selected.push(option);
	 		}
	 		$scope.loadingComboCards = true;
	 		$scope.combos = {};
	 		switch(option.name){
	 			case "Veg":
	 			break;
	 			case "Egg":
	 			break;
	 			case "Non Veg":
	 			break;
	 		}
	 	};

		$scope.offerCombos = function(){
			
		};

		$scope.microCombos = function(){
			
		};

		$scope.mediumCombos = function(){
			
		};

		$scope.megaCombos = function(){
			
		};

}]);

