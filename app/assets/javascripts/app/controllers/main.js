'use strict';

angular.module('foodmashApp.controllers')

.controller('MainController', ['$scope', '$location', 'toaster', '$q', 'Combo', '$rootScope', '$filter', 'AuthService', 'MainService', function($scope, $location, toaster, $q, Combo, $rootScope, $filter, AuthService, MainService){
		$scope.loadedFromPackagingCentre = [];
		$scope.combos = [];
		$scope.selected = MainService.getSelectedSet();
		$scope.sortOptions = MainService.getSortOptions();
		$scope.mainOptions = MainService.getMainOptions();
		$scope.sizeOptions = MainService.getSizeOptions();
		$scope.preferenceOptions = MainService.getPreferenceOptions();
		$scope.selectedSortOption = MainService.getSelectedSortOption();

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
			 	new WOW().init();
			 	$('[data-toggle="tooltip"]').tooltip();
			 	$('[data-toggle="popover"]').popover();
			 });
		};
		
		if($rootScope.loadedFromPackagingCentre){
			$scope.combos = $rootScope.loadedFromPackagingCentre;
			$scope.loadedFromPackagingCentre = $rootScope.loadedFromPackagingCentre;
			$scope.load();
			applyFilters();
		}else{
			$rootScope.loadedFromPackagingCentre = null;
			$scope.loadedFromPackagingCentre = null;
			$rootScope.combo_hash = null;
			$scope.load();
		}

		$scope.$watch('loadCombos', function(n, o){
			if(n == true && $rootScope.area){
				Combo.loadFromPackagingCentre({packaging_centre_id: $rootScope.area.packaging_centre_id}).then(function(loadedFromPackagingCentre){
					if(!$rootScope.combo_hash){
						$scope.combos = loadedFromPackagingCentre.data.combos;
						$scope.loadedFromPackagingCentre = loadedFromPackagingCentre.data.combos;
						$rootScope.loadedFromPackagingCentre = $scope.loadedFromPackagingCentre;
						$rootScope.combo_hash = loadedFromPackagingCentre.data.hash;
					}
					else if($rootScope.combo_hash && loadedFromPackagingCentre.data.hash != $rootScope.combo_hash){
						$scope.combos = loadedFromPackagingCentre.data.combos;
						$scope.loadedFromPackagingCentre = loadedFromPackagingCentre.data.combos;
						$rootScope.loadedFromPackagingCentre = $scope.loadedFromPackagingCentre;
						$rootScope.combo_hash = loadedFromPackagingCentre.data.hash;
					}
					applyFilters();
					AuthService.updateCurrentUser(loadedFromPackagingCentre.data.user);
				}, function(err){
					$scope.combos = null;
					$scope.loadedFromPackagingCentre = null;
					$rootScope.loadedFromPackagingCentre = null;
					$rootScope.combo_hash = null;
				});
			}
		});

		$scope.floatToInt = function(value){
        	return value | 0;
      	};

		$scope.selectSortOption = function(option){
			if($scope.selectedSortOption !== option){
				$scope.selectedSortOption = option;
				MainService.setSelectedSortOption($scope.selectedSortOption);
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
 	 		MainService.setSelectedSet($scope.selected);

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

