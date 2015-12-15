'use strict';

angular.module('foodmashApp.controllers')

.controller('CartPaymentController', ['$scope', '$q', 'toaster','$location','Cart','CartService','$http', 'Payment', function($scope, $q, toaster, $location, Cart, CartService, $http, Payment){

	$scope.cart = {};
	$scope.payment = { 
		"productinfo": 'a bunch of combos from Foodmash',
		"firstname": $scope.currentUser.name.split(" ")[0],
		"email": $scope.currentUser.email,
		"phone": $scope.currentUser.mobile_no,
		"surl": '/payments/success',
		"furl": '/payments/failure',
		"service_provider": 'payu_paisa'
	};

	CartService.getCartInfo().then(function(cart){
		if(cart.orders.length == 0){
			toaster.pop('warning', 'Cart is empty!');
			$location.path("/cart");
		}else{
			$scope.cart = cart;
		}
	}, function(cart){
		$scope.cart = cart;
	});

	$scope.submitToPayu = function(){
		Payment.getHash($scope.payment).then(function(response){
			$scope.payment.hash = response.hash;
			$http({
				method: 'POST',
				url: 'https://test.payu.in/_payment',
				data: $scope.payment
			}).success(function(data){
				console.log('success!!');
				console.log(data);
			}).error(function(data){
				console.log('error!!');
				console.log(data);
			});
		}, function(err){
			toaster.pop('error', 'Could not submit!');
		});
	};

	$scope.payByCod = function(){
		if($scope.password){
			Payment.checkPasswordForCod($scope.password).then(function(response){
				toaster.pop('success', 'Cart was successfully purchased!');
				CartService.refreshCart();
				$location.path('/');
			}, function(err){
				toaster.pop('error', 'Incorrect password!');
			});
		}else{
			toaster.pop('error', 'Password was not entered properly!');
		}
	};

	$scope.payCart = function(status){
		var d = $q.defer();
		Cart.changeStatus(status, $scope.cart.id).then(function(cart){
			toaster.pop('success', 'Cart was successfully purchased!');
			$scope.cart = cart;
			CartService.refreshCart();
			d.resolve(null);
		}, function(err){
			toaster.pop('error', 'Cart was not purchased!');
			d.reject(err);
		});
		return d.promise;
	};

}]);