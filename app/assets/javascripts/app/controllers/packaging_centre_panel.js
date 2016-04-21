'use strict';

angular.module('foodmashApp.controllers')

.controller('PackagingCentrePanelController', ['$scope','$location','toaster','$rootScope', 'PackagingCentre', '$filter', 'PackagingPanelService', '$timeout', function($scope, $location, toaster, $rootScope, PackagingCentre, $filter, PackagingPanelService, $timeout){

	$scope.user = $rootScope.currentUser;
	$scope.roles = $rootScope.currentUser.roles;
	$scope.packaging_centre = {};
	$scope.carts = [];
	$scope.selectedCart = {};
	$scope.selectedStatus = {};
	$scope.packagingPanelOptions = PackagingPanelService.getPackagingPanelOptions();
	$scope.timeoutPromise = {};
	var notification = new Audio('coin.wav');
	$scope.statuses = PackagingPanelService.getPackagingPanelStatuses();
	$scope.sortOptions = PackagingPanelService.getPackagingPanelSortOptions();
	$scope.selectedOption = PackagingPanelService.getSelectedPackagingPanelOption();
	$scope.selectedSortOption = PackagingPanelService.getSelectedSortOption();

	$scope.roles.filter(function(role){
		if(role.name == "packaging_centre_admin"){
			PackagingPanelService.getCartsForPanel(role).then(function(packaging_centre){
				if(packaging_centre && packaging_centre.carts && packaging_centre.carts.length > 0){
					$scope.packaging_centre = packaging_centre;
					$scope.loadedCarts = packaging_centre.carts;
					$scope.carts = packaging_centre.carts ;
				}else{
					$scope.packaging_centre = null;
					$scope.loadedCarts = null;
					$scope.carts = null;
				}
				applyPackagingPanelOptionFilterIfSelected();
				applySortFilterIfSelected();
			}, function(err){
				$scope.loadedCarts = null;
				$scope.packaging_centre = null;
				$scope.carts = null;
				applyPackagingPanelOptionFilterIfSelected();
				applySortFilterIfSelected();
			});
		}
	});

	$scope.routeToPackagingCentreOrder = function(cart){
		PackagingPanelService.setPackagingCentreOrder(cart);
		$location.path('/packagingCentrePanel/Order');
	};

	$scope.load = function(){
		(function tick(){
	    	$scope.roles.filter(function(role){
	    		if(role.name == "packaging_centre_admin"){
	    			PackagingPanelService.loadCartsForPanel(role).then(function(packaging_centre){
	    				if(packaging_centre && packaging_centre.carts && packaging_centre.carts.length > 0){
	    					$scope.packaging_centre = packaging_centre;
	    					checkForNewCarts(packaging_centre.carts);
	    					$scope.loadedCarts = packaging_centre.carts;
	    					$scope.carts = packaging_centre.carts ;
	    				}else{
	    					$scope.packaging_centre = null;
	    					$scope.loadedCarts = null;
	    					$scope.carts = null;
	    				}
	    				applyPackagingPanelOptionFilterIfSelected();
						applySortFilterIfSelected();
	    			}, function(err){
	    				$scope.loadedCarts = null;
	    				$scope.packaging_centre = null;
	    				$scope.carts = null;
	    				applyPackagingPanelOptionFilterIfSelected();
						applySortFilterIfSelected();
	    			});
	    		}
	    	});
	        $scope.timeoutPromise = $timeout(tick, 30000);
	    })();
	    angular.element(document).ready(function (){
	      new WOW().init();
	      $('[data-toggle="tooltip"]').tooltip();
	      $('[data-toggle="popover"]').popover();
	    });
	 };

	 $scope.$on('$destroy', function(){
	 	$timeout.cancel($scope.timeoutPromise);
	 });

	 $scope.selectSortOption = function(option){
	 	$scope.selectedSortOption = option;
	 	PackagingPanelService.setSelectedSortOption($scope.selectedSortOption);
	 	applySortFilterIfSelected();
	 };

	 $scope.checkIfSortOptionSelected = function(option){
	 	if(option == $scope.selectedSortOption){
	 		return true;
	 	};
	 	return false;
	 };

	 $scope.selectOption = function(option){
	 	$scope.selectedOption = option;
	 	PackagingPanelService.setSelectedPackagingPanelOption($scope.selectedOption);
	 	applyPackagingPanelOptionFilterIfSelected();
	 	applySortFilterIfSelected();
	 };

	 $scope.checkIfSelected = function(option){
	 	if(option == $scope.selectedOption){
	 		return true;
	 	}
	 	return false;
	 };

	$scope.checkIfCompleted = function(status){
		if($scope.statuses.indexOf(status) <= $scope.statuses.indexOf($scope.selectedStatus)){
			return true;
		}
		return false;
	};

	$scope.selectCart = function(cart){
		$scope.selectedCart = cart;
		getSuitableStatus(cart.aasm_state);
	};

	$scope.getStatusIcon = function(status){
		var icon_class = '';
		$scope.statuses.filter(function(s){
			if(s.name == status){
				icon_class = 'fa fa-fw ' + s.icon_class.split(" ")[1];
				return icon_class;
			}
		});
		return icon_class;
	};

	$scope.getStatusAlias = function(status){
		var alias = '';
		$scope.statuses.filter(function(s){
			if(s.name == status){
				alias = s.alias;
				return alias;
			}
		});
		return alias;
	};

	function checkForNewCarts(newCarts){
		if(newCarts && newCarts.length && $scope.loadedCarts && $scope.loadedCarts.length && $scope.loadedCarts.length < newCarts.length){
			notification.play();
		}
	};

	function applyPackagingPanelOptionFilterIfSelected(){
		if($scope.selectedOption){
			switch($scope.selectedOption.name){
				case 'Current': 
				if($scope.loadedCarts){
					var deliveredCarts = $filter('filter')($scope.loadedCarts, {aasm_state: 'delivered'}, true);
					$scope.carts = angular.copy($scope.loadedCarts);
					deliveredCarts.filter(function(cart){
						var index = $scope.carts.map(function(c) { return c.id; }).indexOf(cart.id);
						if(angular.isNumber(index) && index != -1){
							$scope.carts.splice(index, 1);
						}
					});
				}
				break;
				case 'Delivered': 
				if($scope.loadedCarts){
					$scope.carts = $filter('filter')($scope.loadedCarts, {aasm_state: 'delivered'}, true);
				}
				break;
			};
		}
	};

	function applySortFilterIfSelected(){
		var orderBy = $filter('orderBy');
	 	if($scope.selectedSortOption){
	 		$scope.carts = orderBy($scope.carts, 'purchased_at', $scope.selectedSortOption.reverse);
	 	}
	};

	function getSuitableStatus(status){
		$scope.statuses.filter(function(s){
			if(s.name == status){
				$scope.selectedStatus = s;
			}
		});
	};

}]);