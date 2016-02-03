'use strict';

angular.module('foodmashApp.controllers')

.controller('MainController', ['$scope', '$location', 'toaster', '$q', 'Combo', '$rootScope', '$filter', function($scope, $location, toaster, $q, Combo, $rootScope, $filter){
		$scope.loadedFromPackagingCentre = [];
		$scope.combos = [];
		$scope.selected = new Set();
		$scope.loadingComboCards = true;

		$scope.mainOptions = 
		[
			{name: "All", icon_class: "fa fa-hashtag pull-right", alias: ''},
			{name: "Regular", icon_class: "fa fa-cutlery pull-right", alias: 'regular'},
			{name: "Budget", icon_class: "fa fa-coffee pull-right", alias: 'budget'},
			{name: "Corporate", icon_class: "fa fa-sitemap pull-right", alias: 'corporate'},
			{name: "Health", icon_class: "fa fa-heartbeat pull-right", alias: 'health'}
		];
		$scope.sizeOptions = 
		[
		   {name: "Micro", icon_class: "icon-user1 pull-right", style: "", alias: 1},
		   {name: "Medium", icon_class: "icon-user2 pull-right", style: "font-size: 18px; margin-top: -3px;", alias: 2},
		   {name: "Mega", icon_class: "icon-user3 pull-right", style: "font-size: 25px; padding: 0; margin-top: -5px;", alias: 3}
		];
		$scope.preferenceOptions = 
		[
			{name: "Veg", icon_class: "fa fa-leaf pull-right", alias: 'veg'},
			{name: "Egg", icon_class: "icon-egg pull-right", alias: 'egg'},
			{name: "Non Veg", icon_class: "icon-meat pull-right", alias: 'non-veg'}
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
				$scope.loadedFromPackagingCentre = loadedFromPackagingCentre.data.combos;
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

		$scope.lessThanOrEqualTo = function(actual, expected){
			console.log(typeof(+expected))
			if(!isNaN(+expected)){
				return actual <= +expected;
			}else{
				return true;
			}
		};

	 	$scope.checkIfMainOptionSelected = function(option){
	 		if($scope.selected.has(option))
	 			return true;
	 		return false;
	 	};

	 	$scope.selectMainOption = function(option){
	 		switch(option.name){
	 			case "All":
	 			break;
	 			case "Regular":
	 				addOrRemoveMainFilters(option);
	 			break;
	 			case "Budget":
	 				addOrRemoveMainFilters(option);
	 			break;
	 			case "Corporate":
	 				addOrRemoveMainFilters(option);
	 			break;
	 			case "Health":
	 				addOrRemoveMainFilters(option);
	 			break;
	 		}
	 	};

 	 	function addOrRemoveMainFilters(option){
 			if($scope.selected.has(option)){
				$scope.selected.delete(option);
				if($scope.selected.size == 0){
					$scope.combos = $scope.loadedFromPackagingCentre;
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {category: option.alias}).filter(function(combo){
						if($scope.combos.indexOf(combo) != -1){
							$scope.combos.splice($scope.combos.indexOf(combo), 1);
						}
					});
				}
			}else{
				if($scope.selected.size == 0){
					$scope.combos = $filter('filter')($scope.loadedFromPackagingCentre, {category: option.alias});
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {category: option.alias}).filter(function(combo){
						if($scope.combos.indexOf(combo) == -1){
							$scope.combos.push(combo);
						}
					});
				}
				$scope.selected.add(option);
			}
 	 	};

	 	$scope.checkIfSizeOptionSelected = function(option){
			if($scope.selected.has(option))
	 			return true;
	 		return false;
	 	};

		$scope.selectSizeOption = function(option){
			switch(option.name){
				case "Micro":
					addOrRemoveSizeFilters(option);
				break;
				case "Medium":
					addOrRemoveSizeFilters(option);
				break;
				case "Mega":
					addOrRemoveSizeFilters(option);
				break;
			}
		};

	 	function addOrRemoveSizeFilters(option){
			if($scope.selected.has(option)){
				$scope.selected.delete(option);
				if($scope.selected.size == 0){
					$scope.combos = $scope.loadedFromPackagingCentre;
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {group_size: option.alias}).filter(function(combo){
						if($scope.combos.indexOf(combo) != -1){
							$scope.combos.splice($scope.combos.indexOf(combo), 1);
						}
					});
				}
			}else{
				if($scope.selected.size == 0){
					$scope.combos = $filter('filter')($scope.loadedFromPackagingCentre, {group_size: option.alias});
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {group_size: option.alias}).filter(function(combo){
						if($scope.combos.indexOf(combo) == -1){
							$scope.combos.push(combo);
						}
					});
				}
				$scope.selected.add(option);
			}
	 	};

	 	$scope.checkIfPreferenceOptionSelected = function(option){
	 		if($scope.selected.has(option))
	 			return true;
	 		return false;
	 	};

	 	$scope.selectPreferenceOption = function(option){
	 		switch(option.name){
	 			case "Veg":
			 		addOrRemovePreferenceFilters(option);
	 			break;
	 			case "Egg":
	 				addOrRemovePreferenceFilters(option);
	 			break;
	 			case "Non Veg":
	 				addOrRemovePreferenceFilters(option);
	 			break;
	 		}
	 	};

	 	function addOrRemovePreferenceFilters(option){
			if($scope.selected.has(option)){
				$scope.selected.delete(option);
				if($scope.selected.size == 0){
					$scope.combos = $scope.loadedFromPackagingCentre;
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {label: option.alias}).filter(function(combo){
						if($scope.combos.indexOf(combo) != -1){
							$scope.combos.splice($scope.combos.indexOf(combo), 1);
						}
					});
				}
			}else{
				if($scope.selected.size == 0){
					$scope.combos = $filter('filter')($scope.loadedFromPackagingCentre, {label: option.alias});
					console.log($scope.combos);
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {label: option.alias}).filter(function(combo){
						if($scope.combos.indexOf(combo) == -1){
							$scope.combos.push(combo);
						}
					});
				}
				$scope.selected.add(option);
			}
	 	};

}]);

