'use strict';

angular.module('foodmashApp.controllers')

.controller('MainController', ['$scope', '$location', 'toaster', '$q', 'Combo', '$rootScope', function($scope, $location, toaster, $q, Combo, $rootScope){
		$scope.combos = {};
		$scope.selected = [];
		$scope.loadingComboCards = true;

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
		
		if($rootScope.combos){
			$scope.combos = $rootScope.combos;
		}else{
			$rootScope.combos = null;
			$rootScope.combos_hash = null;
		}

		Combo.loadFromPackagingCentre().then(function(loadedFromPackagingCentre){
			if(!$rootScope.combos_hash){
				$scope.combos = loadedFromPackagingCentre.data.combos;
				$rootScope.combos = $scope.combos;
				$rootScope.combos_hash = loadedFromPackagingCentre.data.hash;
			}
			else if($rootScope.combos_hash && loadedFromPackagingCentre.data.hash !== $rootScope.combos_hash){
				$scope.combos = loadedFromPackagingCentre.data.combos;
				$rootScope.combos = $scope.combos;
				$rootScope.combos_hash = loadedFromPackagingCentre.data.hash;
			}
			$scope.loadingComboCards = false;
		}, function(err){
			$scope.combos = null;
			$rootScope.combos = null;
			$rootScope.combos_hash = null;
			$scope.loadingComboCards = false;
		});

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

