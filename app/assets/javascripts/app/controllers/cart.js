'use strict';

angular.module('foodmashApp.controllers')

.controller('CartController', ['$scope', '$q', 'toaster','$location','Cart','$timeout','Order', function($scope, $q, toaster, $location, Cart, $timeout, Order){

	$scope.cart = {};
	$scope.order = {};

	$scope.routeToRoot = function(){
		$location.path("/");
	};

	$scope.routeToCheckout = function(){
		$location.path("/checkout");
	};

	$scope.checkForOrders = function(){
		return $scope.cart.orders.length == 0;
	};

	Cart.query().then(function(cart){
		$scope.cart = cart;
	}, function(err){
		$scope.cart = null;
	});

	$scope.updateOrder = function(order, quantity){
		var d = $q.defer();
		Order.query({id: order.id, cart_id: $scope.cart.id}).then(function(response){
			$scope.order = response[0];
			$scope.order.quantity = quantity;
			$scope.order.update().then(function(r){
				$scope.cart.total = $scope.order.cart.total;
				var index = findIndexOfOrder();
				if(angular.isNumber(index)){
					$scope.cart.orders[index].quantity = $scope.order.quantity;
				}
				toaster.pop('success', "Order was updated");
				d.resolve(r);
			}, function(err){
				toaster.pop('error', 'Order was not updated!');
				d.reject(err);
			});
		}, function(err){
			toaster.pop('error', "Order was not found!");
			d.reject(err);
		});
		return d.promise;
	};

	$scope.deleteOrder = function(order){
		var d = $q.defer();
		Order.query({id: order.id, cart_id: $scope.cart.id}).then(function(response){
			$scope.order = response[0];
			$scope.order.delete().then(function(response){
				$scope.cart.total = $scope.order.cart.total;
				var index = findIndexOfOrder();
				if(angular.isNumber(index)){
					$scope.cart.orders.splice(index, 1);
				}
				toaster.pop('success', 'Order has been removed from cart!');
				d.resolve(response);
			}, function(err){
				toaster.pop('error', 'Order was not removed from cart!');
				d.reject(err);
			});
		}, function(err){
			toaster.pop('error', 'Order was not found!');
			d.reject(err);
		});
		return d.promise;
	};

	function findIndexOfOrder(){
		for(var i=0;i<$scope.cart.orders.length; i++){
			if($scope.order.id == $scope.cart.orders[i].id){
				return i;
			}
		}
		return null;
	};

}]);