'use strict';

angular.module('foodmashApp.controllers')

.controller('MainController', ['$scope', 'CombosService', 'AuthService', '$location', 'toaster', '$q', 'Combo', 'CartService', function($scope, CombosService, AuthService, $location, toaster, $q, Combo, CartService){
	$scope.combos = {};
	$scope.selected = null;
	$scope.loadingComboCards = true;

	$scope.edit_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/edit.svg';
	$scope.offers_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/offers.svg';
	$scope.avatar_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/avatar-1.svg';
	$scope.done_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/done.svg';
	$scope.cross_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/cross.svg';
	$scope.bin_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/bin.svg';
	$scope.add_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/add.svg';
	$scope.cart_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/cart.svg';
	$scope.user_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/user.svg';
	$scope.logo_hybrid_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/logo_hybrid.svg';
	$scope.logo_transparent = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/logo_transparent.png';
	$scope.filter_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/filter.svg';
	$scope.wrong_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/wrong.svg';
	$scope.plus_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/plus.svg';
	$scope.minus_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/minus.svg';
	$scope.small_close_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/small_close.svg';
	$scope.right_path = 'https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/right.svg';

	CombosService.loadSideNavOptions().then(function(sideNavOptions){
		$scope.sideNavOptions = sideNavOptions;
		$scope.selected = sideNavOptions[0];
		$scope.selectOption(sideNavOptions[0]);
	});
	
	AuthService.currentUser().then(function(user){
		$scope.user = user;
	});

	$scope.$on('user:unset', function(event){
  		$scope.user = null;
   });

    //Doesn't work
    $scope.toggleSideNav = function(){
        $mdSidenav('sidenav').toggle();
    };
    //Doesn't work

	$scope.routeToCart = function(){
		$location.path("/cart");
	};

 	$scope.routeToRoot = function(){
 	 	$location.path("/");
 	};

	$scope.selectOption = function(option){
		$scope.selected = angular.isNumber(option)? $scope.sideNavOptions[option] : option;
		$scope.loadingComboCards = true;
		$scope.combos = {};
		switch(option.name){
			case "Offers":
			$scope.offerCombos();
			break;
			case "Micro":
			$scope.microCombos();
			break;
			case "Medium":
			$scope.mediumCombos();
			break;
			case "Mega":
			$scope.megaCombos();
			break;
		}
	};

	$scope.offerCombos = function(){
		Combo.loadOfferCombos().then(function(offerCombos){
			$scope.combos = offerCombos;
			$scope.loadingComboCards = false;
		}, function(err){
			$scope.combos = null;
			$scope.loadingComboCards = false;
		});
	};

	$scope.microCombos = function(){
		Combo.loadMicroCombos().then(function(microCombos){
			$scope.combos = microCombos;
			$scope.loadingComboCards = false;
		}, function(err){
			$scope.combos = null;
			$scope.loadingComboCards = false;
		});
	};

	$scope.mediumCombos = function(){
		Combo.loadMediumCombos().then(function(mediumCombos){
			$scope.combos = mediumCombos;
			$scope.loadingComboCards = false;
		}, function(err){
			$scope.combos = null;
			$scope.loadingComboCards = false;
		});
	};

	$scope.megaCombos = function(){
		Combo.loadMegaCombos().then(function(megaCombos){
			$scope.combos = megaCombos;
			$scope.loadingComboCards = false;
		}, function(err){
			$scope.combos = null;
			$scope.loadingComboCards = false;
		});
	};

}]);

