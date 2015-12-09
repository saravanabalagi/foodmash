'use strict';

angular.module('foodmashApp.controllers')

.controller('CartPaymentController', ['$scope', '$q', 'toaster','$location','Cart','CartService','$http', function($scope, $q, toaster, $location, Cart, CartService, $http){

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
		$scope.cart = cart;
	}, function(cart){
		$scope.cart = cart;
	});

	$scope.submitToPayu = function(){
		$http.post({
			url: 'https://test.payu.in/_payment',
			data: $scope.payment
		}).success(function(data){
			console.log('success!!');
			console.log(data);
		}).error(function(data){
			console.log('error!!');
			console.log(data);
		});
	};

	$scope.payCart = function(status){
		var d = $q.defer();
		Cart.changeStatus(status, $scope.cart.id).then(function(cart){
			toaster.pop('success', 'Cart status is changed to purchased!');
			$scope.cart = cart;
			CartService.refreshCart();
			d.resolve(null);
		}, function(err){
			toaster.pop('error', 'Cart status was not changed to purchased!');
			d.reject(err);
		});
		return d.promise;
	};

}]);