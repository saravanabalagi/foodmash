'use strict';

angular.module('foodmashApp.directives')

.directive('orderList', ['toaster','Combo','$q', '$window', function(toaster, Combo, $q, $window){

	return {

		restrict: 'A',

		templateUrl: '/templates/order-list.html',

		controller: ['$scope', 'toaster', 'Combo', '$q', '$window', function($scope, toaster, Combo, $q, $window){

			validateOrder();
			$scope.fillingOrder = false;

			$scope.$watch('order', function(newValue, oldValue) {
			  $scope.old_quantity = oldValue.quantity;
			});

			$scope.addOrder = function(order){
				var index = findOrderInCart(order.id);
				order.quantity += 1;
				$window.fbq('track', 'AddQuantityInCart');
				if(angular.isNumber(index) && index >= 0){
					if(order.quantity >= 1 && order.quantity <=50){
						$scope.updateCartInfo();
						$scope.filling = false;
						toaster.pop('success', 'Order was updated!');
					}else{
						order.quantity = 50;
					}
					if(order.quantity === null){
						$scope.filling = true;
					}if(order.quantity === undefined){
						order.quantity = $scope.old_quantity;
						$scope.updateCartInfo();
						$scope.filling = false;
						toaster.pop('error', 'Order quantity was reset due to invalidity!');
					}
					$scope.$parent.promo = {};
					$scope.$parent.mash_cash = 0;
				}else{
					toaster.pop('error', 'Order was not updated!');
					order.quantity = $scope.old_quantity;
				}
			};

			$scope.removeOrder = function(order){
				var index = findOrderInCart(order.id);
				order.quantity -= 1;
				$window.fbq('track', 'RemoveQuantityInCart');
				if(angular.isNumber(index) && index >= 0){
					if(order.quantity == 0){
						$scope.deleteOrder(order);
					}
					if(order.quantity >= 1 && order.quantity <=50){
						$scope.updateCartInfo();
						$scope.filling = false;
						toaster.pop('success', 'Order was updated!');
					}else{
						order.quantity = 1;
					}
					if(order.quantity === null){
						$scope.filling = true;
					}if(order.quantity === undefined){
						order.quantity = $scope.old_quantity;
						$scope.updateCartInfo();
						$scope.filling = false;
						toaster.pop('error', 'Order quantity was reset due to invalidity!');
					}
					$scope.$parent.promo = {};
					$scope.$parent.mash_cash = 0;
				}else{
					toaster.pop('error', 'Order was not updated!');
					order.quantity = $scope.old_quantity;
				}
			};

			$scope.deleteOrder = function(order){
				var index = findOrderInCart(order.id);
				$window.fbq('track', 'DeleteOrderInCart');
				if(angular.isNumber(index) && index >= 0){		
					$scope.cart.orders.splice(index, 1);
					$scope.updateCartInfo();
					toaster.pop('success', 'Order was removed from cart!');
					$scope.$parent.promo = {};
					$scope.$parent.mash_cash = 0;
				}else{
					toaster.pop('error', 'Order was not removed from cart!');
				}
			};

			function validateOrder(){
				refreshOrderProduct().then(function(){
					if(!$scope.order.product.active || !$scope.order.product.available){
						var index = findOrderInCart($scope.order.id);
						if(angular.isNumber(index) && index >= 0){
							$scope.cart.orders.splice(index, 1);
							$scope.updateCartInfo();
							toaster.pop('error', 'An unavailable combo was removed from the cart!');
						}
					}
				});
				var touched = false;
				for(var i=0;i<$scope.order.order_items.length;i++){
					if($scope.order.order_items[i].quantity === null){
						$scope.order.order_items[i].quantity = 1;
						touched = true;
					}
				}
				if(touched){
					updateOrderInfo();
				}
			};

			function refreshOrderProduct(){
				var d = $q.defer();
				Combo.loadComboAvailability($scope.order.product.id).then(function(combo){
					if(combo){
						$scope.order.product.available = combo.available;
						$scope.order.product.active = combo.active;
						d.resolve(null);
					}
				}, function(err){
					d.reject(err);
				});
				return d.promise;
			};

			function findOrderInCart(order_id){
				for(var i=0;i<$scope.cart.orders.length;i++){
					if($scope.cart.orders[i].id === order_id){
						return i;
					}
				}
				return -1;
			};

			function updateOrderInfo(){
				var total = 0;
				$scope.order.order_items.filter(function(order_item){ 
					var currTotal = order_item["item"].price * order_item.quantity;
					total += currTotal;
				});
				$scope.order.total = total;
				$scope.updateCartInfo();
			};

			function findOrderItemInOrder(order_item_id){
				for(var i=0;i<$scope.order.order_items.length;i++){
					if($scope.order.order_items[i].id === order_item_id){
						return i;
					}
				}
				return -1;
			};

		}]

	};

}])