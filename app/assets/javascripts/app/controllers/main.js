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
                          $(this).css("width","100%");
                          $(this).css("height","auto");
                      }
                    });
                    $('.combo-card').matchHeight();
			 	});
			 });
		};

		$scope.sortOptions = [
			{name: 'Low to High', icon_class: 'fa fa-sort-amount-asc pull-right', reverse: false},
			{name: 'High to Low', icon_class: 'fa fa-sort-amount-desc pull-right', reverse: true}
		];
		$scope.selectedSortOption = $scope.sortOptions[0];

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
			$scope.load();
		}else{
			$rootScope.combos = null;
			$rootScope.combos_hash = null;
			$scope.load();
		}

		$scope.$watch('loadCombos', function(n, o){
			if(n == true && $rootScope.area){
				Combo.loadFromPackagingCentre({packaging_centre_id: $rootScope.area.packaging_centre_id}).then(function(loadedFromPackagingCentre){
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
			}
		});

		$scope.selectSortOption = function(option){
			if($scope.selectedSortOption !== option){
				$scope.selectedSortOption = option;
			}
			applySortFilterIfSelected();
		};

		$scope.checkIfSortOptionSelected = function(option){
			if(option == $scope.selectedSortOption){
				return true;
			};
			return false;
		};

		$scope.lessThanOrEqualTo = function(actual, expected){
			if(!isNaN(+expected)){
				return actual <= +expected;
			}else{
				return true;
			}
		};

	 	$scope.checkIfOptionSelected = function(option){
	 		if($scope.selected.has(option))
	 			return true;
	 		return false;
	 	};

 	 	$scope.addOrRemoveFilters = function(option){
 	 		if($scope.selected.has(option)){
 	 			$scope.selected.delete(option);
 	 		}else{
 	 			$scope.selected.add(option);
 	 		}

 	 		if($scope.selected.size == 0){
 	 			$scope.combos = $scope.loadedFromPackagingCentre;
 	 		}else{
 	 			applyFilters();
 	 		}
 	 		$scope.load();
 	 	};

 	 	$scope.changeArea = function(area){
 	 		$rootScope.area = area;
 	 	};

 	 	function applySortFilterIfSelected(){
 	 		var orderBy = $filter('orderBy');
 	 		if($scope.selectedSortOption){
 	 			$scope.combos = orderBy($scope.combos, 'price', $scope.selectedSortOption.reverse);
 	 		}
 	 		$scope.load();
 	 	};

		function applyFilters(){
			var filteredCombos = [];
			$scope.loadedFromPackagingCentre.filter(function(combo){
				var survive = true;
				if(!checkForSelectedFilters($scope.mainOptions) && !checkIfTypeSelected($scope.mainOptions, combo.category)) survive = false;
				if(!checkForSelectedFilters($scope.sizeOptions) && !checkIfTypeSelected($scope.sizeOptions, combo.group_size)) survive = false;
				if(!checkForSelectedFilters($scope.preferenceOptions) && !checkIfTypeSelected($scope.preferenceOptions, combo.label)) survive = false;
				if(survive) filteredCombos.push(combo);
			});
			$scope.combos = filteredCombos;
			applySortFilterIfSelected();
		};

	 	function checkIfTypeSelected(options, alias){
	 		var isSelected = false;
 			options.filter(function(option){
 				if(option.alias == alias && $scope.selected.has(option)){
 					isSelected = true;
 				}
 				if(option.name == 'Mega' && alias >= option.alias && $scope.selected.has(option)){
 					isSelected = true;
 				}
 			});
 			return isSelected;
	 	};

	 	function checkForSelectedFilters(options){
	 		var isSelected = true;
 			options.filter(function(option){
 				if($scope.selected.has(option)){
 					isSelected = false;
 				}
 			});
 			return isSelected;
	 	};

}]);

