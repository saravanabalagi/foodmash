'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantPanelController', ['$scope','$location','toaster','$rootScope','Restaurant', function($scope, $location, toaster, $rootScope, Restaurant){

	$scope.user = $rootScope.currentUser;
	$scope.roles = $rootScope.currentUser.roles;
	$scope.restaurant = {};
	$scope.carts = [];
	$scope.selectedCart = {};
	$scope.selectedStatus = {};
	$scope.loadingCarts = true;
	$scope.selectedOrderItems = [];
	$scope.statuses = [
		{name: "purchased", alias: "Placed Order", icon_class: "fa fa-clock-o", percent: 'width:0%'},
		{name: "ordered", alias: "Acknowledged", icon_class: "fa fa-check-circle", percent: 'width:35%'},
		{name: "cooked", alias: "Cooked", icon_class: "fa fa-cutlery", percent: 'width:65%'},
		{name: "collected", alias: "Collected", icon_class: "fa fa-truck", percent: 'width:100%'}
	];

	$scope.roles.filter(function(role){
		if(role.name == "restaurant_admin"){
			Restaurant.query({id: role.resource.id}).then(function(restaurants){
				if(restaurants.length > 0){
					$scope.restaurant = restaurants[0];

					$scope.restaurant.getCartsForRestaurant().then(function(carts){
						if(carts.length > 0){
							$scope.carts = carts;
						}else{
							$scope.carts = null;
						}
					}, function(err){
						$scope.carts = null;
					});

				}else{
					$scope.restaurant = null;
				}
			});
		}
	});

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