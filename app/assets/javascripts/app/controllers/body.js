'use strict';

angular.module('foodmashApp.controllers')

.controller('BodyController', ['$scope', '$location', 'toaster', 'CartService', 'City', '$rootScope', function($scope, $location, toaster, CartService, City, $rootScope){

		CartService.setCartGlobally();
		$scope.loadingCities = true;
		$scope.loadCombos = {};

		City.setCity().then(function(cities){
			if(cities.length > 0){
				$scope.cities = cities;
				$scope.selectedCity = cities[0];
				$rootScope.city = $scope.selectedCity;
				$scope.selectedArea = cities[0].areas[0];
				$rootScope.area = $scope.selectedArea;
			}else{
				$scope.cities = null;
			}
			$scope.loadingCities = false;
		}, function(err){
			$scope.cities = null;
			$scope.loadingCities = false;
		});

		$scope.selectCity = function(city){
			$scope.selectedCity = city;
			$rootScope.city = city;
		};

		$scope.selectArea = function(area){
			$scope.selectedArea = area;
			$rootScope.area = area;
		};

		$scope.setLoadCombos = function(){
			$scope.loadCombos = true;
		};

		$scope.checkIfSideBarPresent = function(){
			var current_path = $location.path();
			if(current_path == '/' || current_path == '/panel' || current_path == '/customerPanel' || current_path == '/restaurantPanel' || current_path == '/packagingCentrePanel'){
				return true;
			}else{
				return false;
			}
		};

		$scope.addBodyBackground = function(){
			var current_path = $location.path();
			if(current_path == '/'){
				return true;
			}else{
				return false;
			}
		};

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

