'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantPanelController', ['$scope','$location','toaster','$rootScope','Restaurant', '$filter', function($scope, $location, toaster, $rootScope, Restaurant, $filter){

	$scope.user = $rootScope.currentUser;
	$scope.roles = $rootScope.currentUser.roles;
	$scope.restaurant = {};
	$scope.carts = [];
	$scope.selectedCart = {};
	$scope.selectedStatus = {};
	$scope.loadingCarts = true;
	$scope.selectedOrderItems = [];
	$scope.restaurantPanelOptions = [
		{name: 'Current', icon_class: 'fa fa-inbox pull-right', checkout: 'Delivered'},
		{name: 'Delivered', icon_class: 'fa fa-archive pull-right', checkout: 'Current'}
	];

	$scope.statuses = [
		{name: "purchased", alias: "Placed Order", icon_class: "fa fa-clock-o", percent: 'width:0%'},
		{name: "ordered", alias: "Acknowledged", icon_class: "fa fa-check-circle", percent: 'width:35%'},
		{name: "cooked", alias: "Cooked", icon_class: "fa fa-cutlery", percent: 'width:65%'},
		{name: "collected", alias: "Collected", icon_class: "fa fa-truck", percent: 'width:100%'}
	];

	$scope.sortOptions = [
		{name: 'Newest First', icon_class: 'fa fa-sort-amount-asc pull-right', reverse: true},
		{name: 'Oldest First', icon_class: 'fa fa-sort-amount-desc pull-right', reverse: false}
	];
	$scope.selectedSortOption = $scope.sortOptions[1];

	$scope.roles.filter(function(role){
		if(role.name == "restaurant_admin"){
			Restaurant.query({id: role.resource.id}).then(function(restaurants){
				if(restaurants.length > 0){
					$scope.restaurant = restaurants[0];

					$scope.restaurant.getCartsForRestaurant().then(function(carts){
						if(carts.length > 0){
							$scope.loadedCarts = carts;
							$scope.carts = carts;
						}else{
							$scope.loadedCarts = null;
							$scope.carts = null;
						}
						$scope.selectOption($scope.restaurantPanelOptions[0]);
					}, function(err){
						$scope.loadedCarts = null;
						$scope.carts = null;
						$scope.selectOption($scope.restaurantPanelOptions[0]);
					});

				}else{
					$scope.loadedCarts = null;
					$scope.restaurant = null;
					$scope.selectOption($scope.restaurantPanelOptions[0]);
				}
			});
		}
	});

	$scope.load = function(){
	    angular.element(document).ready(function (){
	      new WOW().init();
	      $('[data-toggle="tooltip"]').tooltip();
	      $('[data-toggle="popover"]').popover();
	    });
	 };

	 $scope.selectSortOption = function(option){
    	$scope.selectedSortOption = option;
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
	 	switch(option.name){
	 		case 'Current': 
	 		if($scope.loadedCarts){
	 			var deliveredCarts = $filter('filter')($scope.loadedCarts, {aasm_state: 'delivered'}, true);
	 			$scope.carts = angular.copy($scope.loadedCarts);
	 			deliveredCarts.filter(function(cart){
	 				var index = $scope.carts.map(function(c) { return c.id; }).indexOf(cart.id);
	 				$scope.carts.splice(index, 1);
	 			});
	 		}
	 		break;
	 		case 'Delivered': 
	 		if($scope.loadedCarts){
	 			$scope.carts = $filter('filter')($scope.loadedCarts, {aasm_state: 'delivered'}, true);
	 		}
	 		break;
	 	};
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
		getOrderItems(cart);
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