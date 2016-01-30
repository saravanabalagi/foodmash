'use strict';

angular.module('foodmashApp.controllers')

.controller('CartController', ['$scope', '$q', 'toaster','$location','CartService','$timeout','$rootScope', 'DeliveryAddress', function($scope, $q, toaster, $location, CartService, $timeout, $rootScope, DeliveryAddress){

	$scope.cart = {};
	$scope.filling = false;

	$scope.delivery_addresses = {};
	$scope.delivery_address = new DeliveryAddress;
	$scope.loadingDeliveryAddresses = true;

	CartService.getCartInfo().then(function(cart){
		$scope.cart = cart;
		calcTaxAndGrandTotal();
	}, function(cart){
		$scope.cart = cart;
	});

	if($rootScope.currentUser){
		DeliveryAddress.query({user_id: $rootScope.currentUser.id}).then(function(delivery_addresses){
			if(delivery_addresses.length > 0){
				$scope.delivery_addresses = delivery_addresses;
				setPrimaryAsDeliveryAddress();
			}else{
				$scope.delivery_addresses = new Array;
				$scope.cart.delivery_address_id = null;
			}
			$scope.loadingDeliveryAddresses = false;
		}, function(err){
			$scope.delivery_addresses = null;
			$scope.loadingDeliveryAddresses = false;
		});
	}

	$scope.isDeliveryAddressSelected = function(delivery_address){
		if($scope.cart.delivery_address_id == delivery_address.id){
			return true;
		}else{
			return false;
		}
	};

	$scope.selectDeliveryAddress = function(delivery_address){
		if($scope.cart.delivery_address_id != delivery_address.id){
			$scope.cart.delivery_address_id = delivery_address.id;
		}
	};

	$scope.proceedToPayment = function(){
		if($scope.cart.total == 0){
			toaster.pop('info', 'Cart is empty!');
			return ;
		}
		if(!$rootScope.currentUser){
			toaster.pop('info', 'Login to proceed to Payment');
			$location.path('/login');
			$rootScope.storeLocation = '/cart';
			return ;
		}
		if(!angular.isNumber($scope.cart.delivery_address_id) && $rootScope.currentUser){
			toaster.pop('info', 'Delivery Address needs to be selected!');
			return ;
		}
		if($scope.cart.total != 0 && angular.isNumber($scope.cart.delivery_address_id) && $rootScope.currentUser){
			$scope.processPayment();
		}
	};

	$scope.processPayment = function(){
		
	};

	// $scope.processCart = function(){
	// 	$scope.cart.delivery_address_id = parseInt($scope.cart_delivery_address_id, 10);
	// 	var d = $q.defer();
	// 	Cart.addToCart($scope.cart).then(function(cart){
	// 		toaster.pop('success', 'Cart was submitted!');
	// 		CartService.setCartInfo(cart);
	// 		$location.path("/cartPayment");
	// 		d.resolve(cart);
	// 	}, function(err){
	// 		toaster.pop('error', 'Cart was not submitted!');
	// 		d.reject(err);
	// 	});
	// 	return d.promise;
	// };

	$scope.addDeliveryAddress = function(addCross){
		var d = $q.defer();
		$scope.delivery_address.save().then(function(response){
			toaster.pop('success', 'Delivery Address was created!');
			$scope.delivery_addresses.push($scope.delivery_address);
			$scope.delivery_address = new DeliveryAddress;
			$scope.reload();
			d.resolve(response);
		}, function(err){
			toaster.pop('error', 'Delivery Address was not created!');
			d.reject(err);
		});
		return d.promise;
	};

	$scope.reload = function(){
		var d = $q.defer();
		DeliveryAddress.query({user_id: $rootScope.currentUser.id}).then(function(delivery_addresses){
		if(delivery_addresses.length > 0){
			$scope.delivery_addresses = delivery_addresses;
			$scope.delivery_addresses.filter(function(delivery_address){
			setPrimaryAsDeliveryAddress();
			});
			d.resolve(null);
		}else{
			$scope.delivery_addresses = new Array;
			$scope.cart.delivery_address_id = null;
			d.resolve(null);
		}
	}, function(err){
		$scope.delivery_addresses = null;
		d.reject(err);
	});
		return d.promise;
	};

	$scope.routeToRoot = function(){
		$location.path("/");
	};

	$scope.routeToCheckout = function(){
		if($rootScope.currentUser){
			$location.path("/checkout");
		}else{
			$rootScope.storeLocation = "/checkout";
			toaster.pop('warning', 'Need to login first!');
			$location.path("/login");
		}
	};

	$scope.checkForOrders = function(){
		return $scope.cart.orders.length == 0;
	};

	$scope.updateCartInfo = function(){
		var total = 0;
		$scope.cart.orders.filter(function(order){ 
			total += order.total * order.quantity;
		});
		$scope.cart.total = total;
		calcTaxAndGrandTotal();
	};

	function calcTaxAndGrandTotal(){
		$scope.cart.tax = parseFloat(($scope.cart.total * 0.145).toFixed(2));
		if($scope.cart.total && $scope.cart.tax){
			$scope.cart.grand_total = $scope.cart.total + $scope.cart.tax + 50.00;
		}else{
			$scope.cart.grand_total = 0;			
		}
	};

	function validateCart(){
		$scope.cart.orders.filter(function(order){
			if(order.quantity === null){
				order.quantity = 1;
				$scope.updateCartInfo();
			}
		});
	};

	function setPrimaryAsDeliveryAddress(){
		$scope.delivery_addresses.filter(function(delivery_address){
			if(delivery_address.primary == true && !angular.isNumber($scope.cart.delivery_address_id)){
				$scope.cart.delivery_address_id = delivery_address.id
			}
		});
	};

}]);