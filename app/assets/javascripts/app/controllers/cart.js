'use strict';

angular.module('foodmashApp.controllers')

.controller('CartController', ['$scope', '$q', 'toaster','$location','CartService','$rootScope', 'DeliveryAddress', 'Cart', 'Payment', '$http', '$httpParamSerializer', function($scope, $q, toaster, $location, CartService, $rootScope, DeliveryAddress, Cart, Payment, $http, $httpParamSerializer){

	$scope.cart = {};
	$scope.cart.delivery_charge = 0;
	$scope.delivery_addresses = [];
	$scope.delivery_address = new DeliveryAddress;
	$scope.loadingDeliveryAddresses = true;
	$scope.payment_method = "";
	$scope.promo = {};
	$scope.mash_cash = 0;
	$scope.setup_details = {};
	if($rootScope.currentUser){
		setNameAndMobileNo();
	}

	CartService.getCartInfo().then(function(cart){
		$scope.cart = cart;
		calcTaxAndGrandTotal();
	}, function(cart){
		$scope.cart = cart;
	});

	$scope.load = function(){
	    angular.element(document).ready(function (){
	      new WOW().init();
	      $('[data-toggle="tooltip"]').tooltip();
	      $('[data-toggle="popover"]').popover();
	    });
	 };

	 $scope.$watch('area.id', function(n, o){
		$scope.reload();
	});

	$scope.reload = function(){
		var d = $q.defer();
		if($rootScope.area && $rootScope.area.id && $rootScope.currentUser && $rootScope.currentUser.id){
			DeliveryAddress.query({user_id: $rootScope.currentUser.id, area_id: $rootScope.area.id}).then(function(delivery_addresses){
				if(delivery_addresses.length > 0){
					$scope.delivery_addresses = delivery_addresses;
					$rootScope.delivery_addresses = delivery_addresses;
					setPrimaryAsDeliveryAddress();
					d.resolve(null);
				}else{
					$scope.delivery_addresses = new Array;
					$scope.cart.delivery_address_id = null;
					$rootScope.delivery_addresses = null;
					d.resolve(null);
				}
				$scope.loadingDeliveryAddresses = false;
			}, function(err){
				$scope.delivery_addresses = null;
				$scope.loadingDeliveryAddresses = false;
				d.reject(err);
			});
		}
		return d.promise;
	};

	 if($rootScope.currentUser && !$rootScope.delivery_addresses && $rootScope.area && $rootScope.area.id){
 			$scope.reload();
	 }else{
	 	if($rootScope.delivery_addresses){
	 		$scope.delivery_addresses = $rootScope.delivery_addresses;
	 	}else{
	 		$scope.delivery_addresses = null;
	 	}
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

	$scope.setCod = function(){
		$scope.payment_method = 'COD';
	};

	$scope.setPayu = function(){
		$scope.payment_method = 'Payu';
	};

	$scope.proceedToPayment = function(){
		if($scope.cart.total == 0){
			toaster.pop('info', 'Cart is empty!');
			return ;
		}
		if(!$rootScope.currentUser){
			toaster.pop('info', 'Login and continue');
			$location.path('/login');
			$rootScope.storeLocation = '/cart';
			return ;
		}
		if(!angular.isNumber($scope.cart.delivery_address_id) && $rootScope.currentUser){
			toaster.pop('info', 'Delivery Address needs to be selected!');
			return ;
		}
		if($scope.cart.total != 0 && angular.isNumber($scope.cart.delivery_address_id) && $rootScope.currentUser && $scope.payment_method == 'Payu'){
			$scope.setup_details["amount"] = $scope.cart.grand_total;
			Payment.getHash($scope.setup_details).then(function(response){
				$scope.setup_details = response.setup_details;
				$scope.processCart();
				angular.element(document).ready(function (){
					$('#payu-payment-form').submit();
				});
			}, function(err){
				toaster.pop('error', 'Could not generate hash');
			});
		}if($scope.cart.total != 0 && angular.isNumber($scope.cart.delivery_address_id) && $rootScope.currentUser && $scope.payment_method == 'COD'){
			$rootScope.disableButton('.cod-button', 'Confirming...');
			Payment.purchaseForCod($scope.cart).then(function(response){
				toaster.pop('success', 'Cart was purchased!');
				$rootScope.enableButton('.cod-button');
				refreshCartAndSelectDelAdd();
			}, function(err){
				toaster.pop('error', 'Cart was not purchased!');
				$rootScope.enableButton('.cod-button');
			});
		}
	};

	$scope.checkForPromoOrMashCash = function(promo_or_mash_cash){
		if(promo_or_mash_cash && isNaN(promo_or_mash_cash) && promo_or_mash_cash.match(/^[a-z0-9]+$/i)){
			if(!$scope.mash_cash){
				applyPromoCode(promo_or_mash_cash);
			}else{
				$scope.mash_cash = $scope.cart.mash_cash = 0;
				calcTaxAndGrandTotal();
				applyPromoCode(promo_or_mash_cash);
			}
		}else if(promo_or_mash_cash && !isNaN(promo_or_mash_cash)){
			if(!$scope.promo.discount){
				useMashCash(promo_or_mash_cash);
			}else{
				$scope.promo = {};
				$scope.cart.promo_id = null; $scope.cart.promo_discount = null;
				calcTaxAndGrandTotal();
				useMashCash(promo_or_mash_cash);
			}
		}
	};

	$scope.processCart = function(){
		var d = $q.defer();
		Cart.addToCart($scope.cart).then(function(cart){
			toaster.pop('success', 'Cart was submitted!');
			refreshCartAndSelectDelAdd();
			d.resolve(cart);
		}, function(err){
			toaster.pop('error', 'Cart was not submitted!');
			d.reject(err);
		});
		return d.promise;
	};

	$scope.addDeliveryAddress = function(){
		var d = $q.defer();
		$scope.delivery_address.area_id = $rootScope.area.id;
		$scope.delivery_address.save().then(function(response){
			toaster.pop('success', 'Delivery Address was created!');
			$scope.delivery_addresses.push($scope.delivery_address);
			$scope.delivery_address = new DeliveryAddress;
			$scope.reload();
			setNameAndMobileNo();
			d.resolve(response);
		}, function(err){
			toaster.pop('error', 'Delivery Address was not created!');
			d.reject(err);
		});
		return d.promise;
	};

	$scope.updateCartInfo = function(){
		var total = 0;
		$scope.cart.orders.filter(function(order){ 
			total += order.total * order.quantity;
		});
		$scope.cart.total = total;
		calcTaxAndGrandTotal();
	};

	$scope.checkIfPromoExists = function(){
		if($scope.promo && $scope.promo.id && $scope.promo.discount){
			return true;
		}
		return false;
	};

	$scope.checkIfMashCashUsed = function(){
		if($scope.mash_cash && !isNaN($scope.mash_cash)){
			return true;
		}
		return false;
	};

	function useMashCash(mash_cash){
		if(mash_cash <= 0){
			toaster.pop('error', 'Mash Cash entered is negligible!');
		}else if(mash_cash > 0 && mash_cash < 150){
			toaster.pop('error', 'Mash Cash must be 150 or more to be utilized!');
		}else if(mash_cash >=150 && $scope.cart.grand_total && !$scope.mash_cash && mash_cash <= $rootScope.currentUser.mash_cash){
			$scope.mash_cash = mash_cash;
			$scope.cart.grand_total -= $scope.mash_cash;
			$scope.cart.grand_total = $scope.cart.grand_total.toFixed(2);
			$scope.cart.mash_cash = $scope.mash_cash;
			toaster.pop('success', 'Mash Cash of ' + $scope.mash_cash + ' was used!');
		}
	};

	function applyPromoCode(promo_code){
		$scope.cart.user_id = $rootScope.currentUser.id;
		Payment.validatePromoCode(promo_code, $scope.cart, $scope.promo).then(function(response){
			if(response.promo_discount){
				toaster.pop('success', 'A discount of ' + response.promo_discount + ' was applied to cart!');
			}else{
				toaster.pop('error', 'Failed to apply promo code!');
			}
			if(response.cart.grand_total && response.cart.promo_id && response.cart.promo_discount){
				$scope.cart.grand_total = response.cart.grand_total.toFixed(2);
				$scope.cart.vat = response.cart.vat;
				$scope.cart.delivery_charge = response.cart.delivery_charge;
				$scope.promo.id = response.cart.promo_id;
				$scope.promo.discount = response.cart.promo_discount;
				if($scope.promo.id && $scope.promo.discount){
					$scope.cart.promo_id = $scope.promo.id;
					$scope.cart.promo_discount = $scope.promo.discount;
				}
			}
		}, function(err){
			toaster.pop('error', 'Failed to apply promo code!');
		});
	};

	function setNameAndMobileNo(){
		$scope.delivery_address.name = $rootScope.currentUser.name;
		$scope.delivery_address.contact_no = $rootScope.currentUser.mobile_no;
	};

	function refreshCartAndSelectDelAdd(){
		$location.path('/customerPanel');
		CartService.refreshCart();
		setPrimaryAsDeliveryAddress();
	};

	function calcTaxAndGrandTotal(){
		$scope.cart.vat = $scope.cart.total * 0.02;
		if($scope.cart.total == 0){
			$scope.cart.delivery_charge = 0;
		}
		if($scope.cart.total){
			if($scope.cart.total < 200){
				$scope.cart.delivery_charge = 30;
				$scope.cart.grand_total = ($scope.cart.total + $scope.cart.vat + $scope.cart.delivery_charge).toFixed(2);
			}else{
				$scope.cart.delivery_charge = 40;
				$scope.cart.grand_total = ($scope.cart.total + $scope.cart.vat + $scope.cart.delivery_charge).toFixed(2);
			}
		}else{
			$scope.cart.grand_total = (0).toFixed(2);			
		}
	};

	function setPrimaryAsDeliveryAddress(){
		$scope.delivery_addresses.filter(function(delivery_address){
			if(delivery_address.primary == true && !angular.isNumber($scope.cart.delivery_address_id)){
				$scope.cart.delivery_address_id = delivery_address.id
			}
		});
	};

}]);