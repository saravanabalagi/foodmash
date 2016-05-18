'use strict';

angular.module('foodmashApp.controllers')

.controller('CustomerPanelController', ['$scope','$location','toaster','$rootScope','Cart', 'CustomerPanelService', '$filter', 'ProfileService', 'AuthService', '$timeout', function($scope, $location, toaster, $rootScope, Cart, CustomerPanelService, $filter, ProfileService, AuthService, $timeout){

	$scope.carts = [];
	$scope.selectedCart = CustomerPanelService.getSelectedCustomerPanelCart();
	$scope.selectedStatus = {};
	$scope.customerPanelOptions = CustomerPanelService.getCustomerPanelOptions();
	$scope.statuses = CustomerPanelService.getCustomerPanelStatuses();
	$scope.sortOptions = CustomerPanelService.getCustomerPanelSortOptions();
	$scope.selectedOption = CustomerPanelService.getSelectedCustomerPanelOption();
	$scope.selectedSortOption = CustomerPanelService.getSelectedCustomerPanelSortOption();
	$scope.timeoutPromise = {};
	getSuitableStatus($scope.selectedCart);

	ProfileService.loadUserForProfile().then(function(user){
	  	AuthService.updateCurrentUser(user);
	}, function(err){
	});

	CustomerPanelService.getCartsForCustomer().then(function(carts){
		if(carts && carts.length > 0){
			$scope.loadedCarts = carts;
			$scope.carts = carts;
		}else{
			$scope.loadedCarts = null;
			$scope.carts = null;
		}
		applyCustomerPanelFilterIfSelected();
		applySortFilterIfSelected();
		$scope.selectCart($scope.selectedCart || $scope.carts[0]);
	}, function(err){
		$scope.loadedCarts = null;
		$scope.carts = null;
	});

	$scope.load = function(){
	      angular.element(document).ready(function (){
	      	new WOW().init();
	      	$('[data-toggle="tooltip"]').tooltip();
	      	$('[data-toggle="popover"]').popover();
	      });
      	(function tick(){
	  	     CustomerPanelService.loadCartsForCustomer().then(function(carts){
	  			if(carts && carts.length > 0){
	  				$scope.loadedCarts = carts;
	  				$scope.carts = carts;
	  			}else{
	  				$scope.loadedCarts = null;
	  				$scope.carts = null;
	  			}
	  			applyCustomerPanelFilterIfSelected();
	  			applySortFilterIfSelected();
	  			$scope.selectCart($scope.selectedCart || $scope.carts[0]);
	  		}, function(err){
	  			$scope.loadedCarts = null;
	  			$scope.carts = null;
	  		});
          	$scope.timeoutPromise = $timeout(tick, 30000);
         })();
    };

    $scope.$on('$destroy', function(){
	 	$timeout.cancel($scope.timeoutPromise);
	 });

    $scope.selectSortOption = function(option){
    	$scope.selectedSortOption = option;
    	CustomerPanelService.setSelectedCustomerPanelSortOption($scope.selectedSortOption);
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
    	CustomerPanelService.setSelectedCustomerPanelOption($scope.selectedOption);
    	$scope.selectedCart = {};
    	CustomerPanelService.setSelectedCustomerPanelCart(null);
    	applyCustomerPanelFilterIfSelected();
    	applySortFilterIfSelected();
    };

    $scope.checkIfOptionSelected = function(option){
    	if(option == $scope.selectedOption){
    		return true;
    	}
    	return false;
    };

    $scope.checkIfCartSelected = function(cart){
    	if(cart && $scope.selectedCart && cart.id && $scope.selectedCart.id && cart.id == $scope.selectedCart.id){
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
		CustomerPanelService.setSelectedCustomerPanelCart($scope.selectedCart);
		getSuitableStatus($scope.selectedCart);
		angular.element(document).ready(function (){
			new WOW().init();
			$('[data-toggle="tooltip"]').tooltip();
			$('[data-toggle="popover"]').popover();
		});
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

	$scope.calculateOrderPrice = function(order){
		var price = 0.0;
		order.order_items.filter(function(oi){
			price += oi.quantity * oi.item.price * order.quantity;
		});
		return price;
	};

	function applyCustomerPanelFilterIfSelected(){
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
    	if($scope.selectedSortOption && $scope.carts){
    		$scope.carts = orderBy($scope.carts, 'purchased_at', $scope.selectedSortOption.reverse);
    	}
	};

	function getSuitableStatus(cart){
		$scope.statuses.filter(function(s){
			if(cart && cart.aasm_state && s.name == cart.aasm_state){
				$scope.selectedStatus = s;
			}
		});
	};

}]);