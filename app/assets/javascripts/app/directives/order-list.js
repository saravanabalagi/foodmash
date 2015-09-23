'use strict';

angular.module('foodmashApp.directives')

.directive('orderList', ['toaster','Combo', function(toaster, Combo){

	return {

		restrict: 'E',

		templateUrl: '/templates/order-list.html',

		controller: ['$scope', 'toaster', function($scope, toaster){

			validateOrder();
			
			$scope.$watch('order', function(newValue, oldValue) {
			  $scope.old_quantity = oldValue.quantity;
			});

			$scope.updateOrder = function(order){
				var index = findOrderInCart(order.id);
				if(angular.isNumber(index) && index >= 0){
					if(order.quantity >= 1 && order.quantity <=500){
						$scope.updateCartInfo();
						$scope.filling = false;
						toaster.pop('success', 'Order was updated!');
					}if(order.quantity === null){
						$scope.filling = true;
					}if(order.quantity === undefined){
						order.quantity = $scope.old_quantity;
						$scope.updateCartInfo();
						$scope.filling = false;
						toaster.pop('error', 'Order quantity was reset due to invalidity!');
					}
				}else{
					toaster.pop('error', 'Order was not updated!');
					order.quantity = $scope.old_quantity;
				}
			};

			$scope.deleteOrder = function(order){
				var index = findOrderInCart(order.id);
				if(angular.isNumber(index) && index >= 0){		
					$scope.cart.orders.splice(index, 1);
					$scope.updateCartInfo();
					toaster.pop('success', 'Order was removed from cart!');
				}else{
					toaster.pop('error', 'Order was not removed from cart!');
				}
			};

			function validateOrder(){
				refreshOrderProduct();
				if(!$scope.order.product.active || !$scope.order.product.available){
					var index = findOrderInCart($scope.order.id);
					if(angular.isNumber(index) && index >= 0){
						$scope.cart.orders.splice(index, 1);
						$scope.updateCartInfo();
						toaster.pop('error', 'An unavailable combo was removed from the cart!');
					}
				}
			};

			function refreshOrderProduct(){
				Combo.loadComboAvailability($scope.order.product.id).then(function(combos){
					if(combos.length > 0){
						$scope.order.product.available = combos[0].available;
						$scope.order.product.active = combos[0].active;
					}
				});
			};

			function findOrderInCart(order_id){
				for(var i=0;i<$scope.cart.orders.length;i++){
					if($scope.cart.orders[i].id === order_id){
						return i;
					}
				}
				return -1;
			};

		}]

	};

}])