'use strict';

angular.module('foodmashApp.controllers')

.controller('BodyController', ['$scope', '$location', 'toaster', 'CartService', function($scope, $location, toaster, CartService){

		$scope.logo_transparent = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/logo_transparent.png';

		CartService.setCartGlobally();

		$scope.routeToCart = function(){
			$location.path("/cart");
		};

	 	$scope.routeToRoot = function(){
	 	 	$location.path("/");
	 	};

	 	$scope.routeToTermsAndConditions = function(){
	 		$location.path("/terms-and-conditions");
	 	};

	 	$scope.routeToPrivacyPolicy = function(){
	 		$location.path("/privacy-policy");
	 	};

	 	$scope.routeToRefundPolicy = function(){
	 		$location.path("/refund-policy");
	 	};

	 	$scope.routeToAboutUs = function(){
	 		$location.path("/about-us");
	 	};

}]);

