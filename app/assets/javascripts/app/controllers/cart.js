'use strict';

angular.module('foodmashApp.controllers')

.controller('CartController', ['$scope', '$q', 'toaster','$location','CartService','$timeout', function($scope, $q, toaster, $location, CartService, $timeout){

	$scope.cart = {};
	$scope.filling = false;

	$scope.routeToRoot = function(){
		$location.path("/");
	};

	$scope.routeToCheckout = function(){
		$location.path("/checkout");
	};

	$scope.checkForOrders = function(){
		return $scope.cart.orders.length == 0;
	};

	CartService.getCartInfo().then(function(cart){
		$scope.cart = cart;
		validateCart();
	}, function(cart){
		$scope.cart = cart;
	});

	$scope.updateOrder = function(order, quantity){
		var index = $scope.cart.orders.indexOf(order);
		if(angular.isNumber(index)){
			if(quantity >= 1 && quantity <=500){
				updateCartInfo();
				$scope.filling = false;
				toaster.pop('success', 'Order was updated!');
			}if(quantity === null){
				$scope.filling = true;
			}if(quantity === undefined){
				order.quantity = 1;
				updateCartInfo();
				$scope.filling = false;
				toaster.pop('error', 'Order quantity was reset due to invalidity!');
			}
		}else{
			toaster.pop('error', 'Order was not updated!');
		}
	};

	$scope.deleteOrder = function(order){
		var index = $scope.cart.orders.indexOf(order);
		if(angular.isNumber(index)){		
			$scope.cart.orders.splice(index, 1);
			updateCartInfo();
			toaster.pop('success', 'Order was removed from cart!');
		}else{
			toaster.pop('error', 'Order was not removed from cart!');
		}
	};

	function updateCartInfo(){
		var total = 0;
		$scope.cart.orders.filter(function(order){ 
			var currTotal = order.price * order.quantity;
			total += currTotal;
			order.total = currTotal;
		});
		$scope.cart.total = total;
	};

	function validateCart(){
		$scope.cart.orders.filter(function(order){
			if(order.quantity === null){
				order.quantity = 1;
				updateCartInfo();
			}
		});
	};

}]);