'use strict';

angular.module('foodmashApp.controllers')

.controller('MainController', ['$scope', '$location', 'toaster', '$q', 'Combo', '$rootScope', '$filter', function($scope, $location, toaster, $q, Combo, $rootScope, $filter){
		$scope.loadedFromPackagingCentre = [];
		$scope.combos = [];
		$scope.selected = new Set();
		$scope.loadingComboCards = true;

		$scope.load = function(){
			 angular.element(document).ready(function (){
			 	$(function(){
                    $(".thumbnail > .img-wrapper").each(function() { $(this).height($(this).width()*0.75); });
                    $(".thumbnail.combo-card .img-wrapper > img").each(function() {
                        if($(this).width()!=0
                            && $(this).height()!=0
                            && $(this).height()>$(this).width()*0.75) {
                            $(this).css("width","100%");
                            $(this).css("height","auto");
                        }
                    });
                    $(".thumbnail.combo-card .img-wrapper > img").load(function() {
                      if($(this).height()>$(this).width()*0.75) {
                          console.log($(this).width() + ", " + $(this).height());
                          $(this).css("width","100%");
                          $(this).css("height","auto");
                      }
                    });
                    $('.combo-card').matchHeight();
			 	});
			 });
		};

		$scope.mainOptions = 
		[
			{name: "Regular", icon_class: "fa fa-cutlery pull-right", alias: 'Regular'},
			{name: "Budget", icon_class: "fa fa-coffee pull-right", alias: 'Budget'},
			{name: "Corporate", icon_class: "fa fa-sitemap pull-right", alias: 'Corporate'},
			{name: "Health", icon_class: "fa fa-heartbeat pull-right", alias: 'Health'}
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
			$scope.loadedFromPackagingCentre = $rootScope.combos;
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

 	 	$scope.addOrRemoveMainFilters = function(option){
 			if($scope.selected.has(option)){
				$scope.selected.delete(option);
				if($scope.selected.size == 0){
					$scope.combos = $scope.loadedFromPackagingCentre;
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {category: option.alias}, true).filter(function(combo){
						if($scope.combos.indexOf(combo) != -1){
							var index = $scope.combos.indexOf(combo);
							$scope.combos[index].filter -= 1;
							if($scope.combos[index].filter == 0){
								$scope.combos.splice(index, 1);
							}
						}
					});
				}
			}else{
				if($scope.selected.size == 0){
					$scope.combos = $filter('filter')($scope.loadedFromPackagingCentre, {category: option.alias}, true);
					$scope.combos.filter(function(combo){
						combo.filter = 1;
					});
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {category: option.alias}, true).filter(function(combo){
						if(combo.filter){
							combo.filter += 1;
						}else{
							combo.filter = 1;
						}
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

	 	$scope.addOrRemoveSizeFilters = function(option){
			if($scope.selected.has(option)){
				$scope.selected.delete(option);
				if($scope.selected.size == 0){
					$scope.combos = $scope.loadedFromPackagingCentre;
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {group_size: option.alias}).filter(function(combo){
						if($scope.combos.indexOf(combo) != -1){
							var index = $scope.combos.indexOf(combo);
							$scope.combos[index].filter -= 1;
							if($scope.combos[index].filter == 0){
								$scope.combos.splice(index, 1);
							}
						}
					});
				}
			}else{
				if($scope.selected.size == 0){
					$scope.combos = $filter('filter')($scope.loadedFromPackagingCentre, {group_size: option.alias});
					$scope.combos.filter(function(combo){
						combo.filter = 1;
					});
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {group_size: option.alias}).filter(function(combo){
						if(combo.filter){
							combo.filter += 1;
						}else{
							combo.filter = 1;
						}
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

	 	$scope.addOrRemovePreferenceFilters = function(option){
			if($scope.selected.has(option)){
				$scope.selected.delete(option);
				if($scope.selected.size == 0){
					$scope.combos = $scope.loadedFromPackagingCentre;
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {label: option.alias}, true).filter(function(combo){
						if($scope.combos.indexOf(combo) != -1){
							var index = $scope.combos.indexOf(combo);
							$scope.combos[index].filter -= 1;
							if($scope.combos[index].filter == 0){
								$scope.combos.splice(index, 1);
							}
						}
					});
				}
			}else{
				if($scope.selected.size == 0){
					$scope.combos = $filter('filter')($scope.loadedFromPackagingCentre, {label: option.alias}, true);
					$scope.combos.filter(function(combo){
						combo.filter = 1;
					});
				}else{
					$filter('filter')($scope.loadedFromPackagingCentre, {label: option.alias}, true).filter(function(combo){
						if(combo.filter){
							combo.filter += 1;
						}else{
							combo.filter = 1;
						}
						if($scope.combos.indexOf(combo) == -1){
							$scope.combos.push(combo);
						}
					});
				}
				$scope.selected.add(option);
			}
	 	};

}]);

