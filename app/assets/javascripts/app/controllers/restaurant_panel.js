'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantPanelController', ['$scope','$location','toaster','$rootScope','Restaurant', '$filter', 'RestaurantPanelService', '$timeout', function($scope, $location, toaster, $rootScope, Restaurant, $filter, RestaurantPanelService, $timeout){

	$scope.user = $rootScope.currentUser;
	$scope.roles = $rootScope.currentUser.roles;
	$scope.restaurant = {};
	$scope.carts = [];
	$scope.selectedCart = RestaurantPanelService.getSelectedRestaurantPanelCart();
	$scope.selectedStatus = {};
	$scope.loadingCarts = true;
	$scope.selectedOrderItems = [];
	$scope.restaurantPanelOptions = RestaurantPanelService.getRestaurantPanelOptions();
	$scope.statuses = RestaurantPanelService.getRestaurantPanelStatuses();
	$scope.sortOptions = RestaurantPanelService.getRestaurantPanelSortOptions();
	$scope.selectedOption = RestaurantPanelService.getSelectedRestaurantPanelOption();
	$scope.selectedSortOption = RestaurantPanelService.getSelectedSortOption();
	$scope.timeoutPromise = {};

	$scope.roles.filter(function(role){
		if(role.name == "restaurant_admin"){
			RestaurantPanelService.getCartsForPanel(role).then(function(restaurant){
				if(restaurant && restaurant.carts && restaurant.carts.length > 0){
					$scope.restaurant = restaurant;
					$scope.loadedCarts = restaurant.carts;
					$scope.carts = restaurant.carts ;
					updateSelectedCart();
	  				$scope.selectCart($scope.selectedCart || $scope.carts[0]);
				}else{
					$scope.restaurant = null;
					$scope.loadedCarts = null;
					$scope.carts = null;
				}
				applyRestaurantPanelOptionFilterIfSelected();
				applySortFilterIfSelected();
			}, function(err){
				$scope.loadedCarts = null;
				$scope.restaurant = null;
				$scope.carts = null;
				applyRestaurantPanelOptionFilterIfSelected();
				applySortFilterIfSelected();
			});
		}
	});

	$scope.load = function(){
		(function tick(){
			$scope.roles.filter(function(role){
				if(role.name == "restaurant_admin"){
					RestaurantPanelService.loadCartsForPanel(role).then(function(restaurant){
						if(restaurant && restaurant.carts && restaurant.carts.length > 0){
							$scope.restaurant = restaurant;
							$scope.loadedCarts = restaurant.carts;
							$scope.carts = restaurant.carts ;
							updateSelectedCart();
							$scope.selectCart($scope.selectedCart || $scope.carts[0]);
						}else{
							$scope.restaurant = null;
							$scope.loadedCarts = null;
							$scope.carts = null;
						}
						applyRestaurantPanelOptionFilterIfSelected();
						applySortFilterIfSelected();
					}, function(err){
						$scope.loadedCarts = null;
						$scope.restaurant = null;
						$scope.carts = null;
						applyRestaurantPanelOptionFilterIfSelected();
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
    	applyRestaurantPanelOptionFilterIfSelected();
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
	 	RestaurantPanelService.setSelectedRestaurantPanelOption($scope.selectedOption);
	 	$scope.selectedCart = {};
	 	applyRestaurantPanelOptionFilterIfSelected();
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
		RestaurantPanelService.setSelectedRestaurantPanelCart($scope.selectedCart);
		getSuitableStatus($scope.selectedCart.aasm_state);
		getOrderItems(cart);
		angular.element(document).ready(function (){
			new WOW().init();
			$('[data-toggle="tooltip"]').tooltip();
			$('[data-toggle="popover"]').popover();
		});
	};

	$scope.selectedOrderItemsTotal = function(){
		var total = 0;
		if($scope.selectedOrderItems.length > 0){
			$scope.selectedOrderItems.filter(function(order_item){
				total += order_item.quantity * order_item.item.price;
			});
		}
		return total;
	};

	function updateSelectedCart(){
		if($scope.selectedCart && $scope.selectedCart.id){
			$scope.carts.filter(function(cart){ if(cart.id == $scope.selectedCart.id){ var index = $scope.carts.indexOf(cart); $scope.selectedCart =  $scope.carts[index]; } });
		}
	};

	function applyRestaurantPanelOptionFilterIfSelected(){
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

	function getSuitableStatus(status){
		$scope.statuses.filter(function(s){
			if(s.name == status){
				$scope.selectedStatus = s;
			}
		});
	};

	function getOrderItems(cart){
		$scope.selectedOrderItems = [];
		cart.orders.filter(function(order){
			order.order_items.filter(function(order_item){
				if(order_item.item.restaurant.id == $scope.restaurant.id){
					$scope.selectedOrderItems.push(order_item);
				};
			});
		});
	};

}]);