'use strict';

angular.module('foodmashApp.directives')

.directive('orderList', ['toaster','Combo','$q', '$window', function(toaster, Combo, $q, $window){

	return {

		restrict: 'A',

		templateUrl: '/templates/order-list.html',

		controller: ['$scope', 'toaster', 'Combo', '$q', '$window', function($scope, toaster, Combo, $q, $window){

			validateOrder();
            $scope.subwayTabs = ["Bread", "Sauce", "Veggies"];

            $scope.subwayBreads = ["Honey Oat", "White Italian", "Parmesan Oregano", "Multigrain Honeyoat", "Roasted Garlic", "Random"];
            $scope.subwayBreadToastTypes = ["Toasted", "Plain"];
            $scope.subwayVeggies = ["All Veggies", "Jalapenos", "Onion", "Tomato", "Olive", "Lettuce", "Capsicum", "Pickles"];
            $scope.subwaySauces = ["Mustard", "Honey Mustard", "Mayonnaise", "Harissa Mayo", "Mint Mayo", "Southwest", "Barbecue", "Tamarind", "Sweet Onion", "Red Chilly"];

            $scope.selectedBread = $scope.subwayBreads[$scope.subwayBreads.length -1];
            $scope.selectedBreadToastType = $scope.subwayBreadToastTypes[0];
            $scope.selectedVeggies = [$scope.subwayVeggies[0]];
            $scope.selectedSauces = [];

            $scope.selectBread = function(bread, orderItem) {
                $scope.selectedBread = bread;
                orderItem["note"]["selectedBread"]= $scope.selectedBread;
                console.log($scope.selectedBread);
                console.log(orderItem);
            };
            $scope.selectBreadToastType = function(type, orderItem) {
                $scope.selectedBreadToastType = type;
                orderItem["note"]["selectedBreadToastType"]= $scope.selectedBreadToastType;
                console.log($scope.selectedBreadToastType);
            };
            $scope.selectVeggie = function(veggie, orderItem) {
                if($scope.subwayVeggies.indexOf(veggie)==0) {
                    $scope.selectedVeggies = [$scope.subwayVeggies[0]];
                    return;
                }
                var index = $scope.selectedVeggies.indexOf(veggie);
                if(index>-1) $scope.selectedVeggies.splice(index,1);
                else {
                    var indexOfAllVeggies = $scope.selectedVeggies.indexOf($scope.subwayVeggies[0]);
                    if(indexOfAllVeggies>-1) $scope.selectedVeggies.splice(indexOfAllVeggies,1);
                    $scope.selectedVeggies.push(veggie);
                }
                if($scope.selectedVeggies.length==0) $scope.selectedVeggies.push($scope.subwayVeggies[0]);
                orderItem["note"]["selectedVeggies"]= $scope.selectedVeggies;
                console.log($scope.selectedVeggies);
            };
            $scope.selectSauce = function(sauce, orderItem) {
                var index = $scope.selectedSauces.indexOf(sauce);
                if(index>-1) $scope.selectedSauces.splice(index,1);
                else $scope.selectedSauces.push(sauce);
                if($scope.selectedSauces.length>5) { $scope.selectedSauces.splice($scope.selectedSauces.length-1,1); return false; }
                orderItem["note"]["selectedSauces"]= $scope.selectedSauces;
                console.log($scope.selectedSauces);
            };

            $scope.isSelectedBread = function(bread){ return $scope.selectedBread == bread; };
            $scope.isSelectedBreadToastType = function(type){ return $scope.selectedBreadToastType == type; };
            $scope.isSelectedVeggie = function(veggie){ return $scope.selectedVeggies.indexOf(veggie)>-1; };
            $scope.isSelectedSauce = function(sauce){ return $scope.selectedSauces.indexOf(sauce)>-1; };

            $scope.getNoteJson = function() {
                var note = {};
                note["selectedBread"] = $scope.selectedBread;
                note["selectedBreadToastType"] = $scope.selectedBreadToastType;
                note["selectedVeggies"] = $scope.selectedVeggies;
                note["selectedSauces"] = $scope.selectedSauces;
                note["extras"] = "";
                return note;
            };

            $scope.selectedSubwayTab = $scope.subwayTabs[0];
			$scope.fillingOrder = false;

            $scope.checkIfSubwayTabSelected = function(t){ return $scope.selectedSubwayTab == t; };
            $scope.selectSubwayTab = function(t){ $scope.selectedSubwayTab = t; };

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
			}

            $scope.hasSubway = function() {
                var isSubwayPresent = false;
                for(var i=0;i<$scope.order.order_items.length;i++){
                    if($scope.order.order_items[i].item.restaurant.name.indexOf('Subway') > -1)
                        isSubwayPresent = true;
                }
                return isSubwayPresent;
            }

		}]

	};

}])