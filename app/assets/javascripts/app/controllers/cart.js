'use strict';

angular.module('foodmashApp.controllers')

.controller('CartController', ['$scope', '$q', 'toaster','$location','CartService','$rootScope', 'DeliveryAddress', 'Cart', 'Payment', '$http', '$httpParamSerializer', '$window', function($scope, $q, toaster, $location, CartService, $rootScope, DeliveryAddress, Cart, Payment, $http, $httpParamSerializer, $window){

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
		if($scope.cart.delivery_address_id && $scope.cart.delivery_address_id == delivery_address.id){
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
		if($rootScope.currentUser && !$rootScope.currentUser.verified){
			toaster.pop('error', 'Please verify account before placing an order!');
			$location.path('/account');
		}else{
			if(validateCart()){
				if($scope.cart.total != 0 && angular.isNumber($scope.cart.delivery_address_id) && $rootScope.currentUser && $scope.payment_method == 'Payu'){
					$scope.setup_details["amount"] = $scope.cart.grand_total;
					Payment.getHash($scope.setup_details).then(function(response){
						$scope.setup_details = response.setup_details;
						$scope.processCart();
						angular.element(document).ready(function (){
							$window.fbq('track', 'Purchase', {value: $scope.cart.grand_total, currency: 'INR'});
							$('#payu-payment-form').submit();
						});
					}, function(err){
						toaster.pop('error', 'Could not generate hash');
					});
				}if($scope.cart.total != 0 && angular.isNumber($scope.cart.delivery_address_id) && $rootScope.currentUser && $scope.payment_method == 'COD'){
					$rootScope.disableButton('.cod-button', 'Confirming...');
					Payment.purchaseForCod($scope.cart).then(function(response){
						$window.fbq('track', 'Purchase', {value: $scope.cart.grand_total, currency: 'INR'});
						toaster.pop('success', 'Cart was purchased!');
						$rootScope.enableButton('.cod-button');
						refreshCartAndSelectDelAdd();
					}, function(err){
						toaster.pop('error', 'Cart was not purchased!');
						$rootScope.enableButton('.cod-button');
					});
				}
			}
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

	$scope.floatToInt = function(value){
    	return value | 0;
  	};

  	function validateCart(){
  		if($scope.cart.total == 0){
  			toaster.pop('info', 'Cart is empty!');
  			return false;
  		}
  		if(!$rootScope.currentUser){
  			toaster.pop('info', 'Login and continue');
  			$location.path('/login');
  			$rootScope.storeLocation = '/cart';
  			return false;
  		}
  		if($rootScope.currentUser && !isDeliveryAddressSelectedFromList()){
  			toaster.pop('info', 'Delivery Address needs to be selected!');
  			return false;
  		}
  		if(!checkIfDifferentDishtypesInCart()){
  			toaster.pop('error', 'Add atleast 2 different dish types to cart!');
  			return false;
  		}
  		return true;
  	};

  	function isDeliveryAddressSelectedFromList(){
  		var check = false;
  		if($scope.delivery_addresses.length > 0){
	  		$scope.delivery_addresses.filter(function(del_add){
	  			if($scope.isDeliveryAddressSelected(del_add)){
	  				check = true;
	  			}
	  		});
  		}
  		return check;
  	};

	function checkIfDifferentDishtypesInCart(){
		var check = false;
		if($scope.cart && $scope.cart.grand_total){
			var dish_types = new Set();
			$scope.cart.orders.filter(function(order){
				order.order_items.filter(function(order_item){
					if(!dish_types.has(order_item.item.dish_type_id)){
						dish_types.add(order_item.item.dish_type_id);
					}
				});
			});
			if(dish_types.size >= 2){
				check = true;
			}
		}
		return check;
	};

	function useMashCash(mash_cash){
		if(mash_cash <= 0){
			toaster.pop('error', 'Mash Cash entered is negligible!');
		}else if(mash_cash > 0 && mash_cash < 150){
			toaster.pop('error', 'Mash Cash less than 150 cannot be utilized!');
		}else if(mash_cash >=150 && $scope.cart.grand_total && !$scope.mash_cash){
			if(mash_cash > $scope.cart.grand_total){
				toaster.pop('error', 'Cart grand total is lesser than Mash Cash value!');
			}else if($rootScope.currentUser.mash_cash >= 150 && mash_cash <= $rootScope.currentUser.mash_cash){
				$scope.mash_cash = mash_cash;
				$scope.cart.grand_total -= $scope.mash_cash;
				$scope.cart.grand_total = $scope.cart.grand_total.toFixed(2);
				$scope.cart.mash_cash = $scope.mash_cash;
				toaster.pop('success', 'Mash Cash of ' + $scope.mash_cash + ' was used!');
			}
			else{
				toaster.pop('error', 'Your account does not have enough Mash Cash!');
			}
		}
	};

	function applyPromoCode(promo_code){
		$scope.cart.user_id = $rootScope.currentUser.id;
		calcTaxAndGrandTotal();
		Payment.validatePromoCode(promo_code, $scope.cart, $scope.promo).then(function(response){
			if(response.promo_discount){
				toaster.pop('success', 'A discount of ' + response.promo_discount + ' was applied to cart!');
			}else{
				toaster.pop('error', 'Failed to apply promo code!');
				$scope.promo = {};
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
			$scope.promo = {};
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
				if($scope.cart.total >= 1000){
					$scope.cart.delivery_charge = 100;
				}else{
					$scope.cart.delivery_charge = 40;
				}
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