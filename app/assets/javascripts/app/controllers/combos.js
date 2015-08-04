'use strict';

angular.module('foodmashApp.controllers')

.controller('CombosController', ['$scope', 'CombosService','AuthService','$location','toaster' ,'CartService','Combo' , function($scope, CombosService, AuthService, $location, toaster, CartService, Combo){
	$scope.combos = {};
	$scope.selected = null;

	CombosService.loadSideNavOptions().then(function(sideNavOptions){
		$scope.sideNavOptions = sideNavOptions;
		$scope.selected = sideNavOptions[0];
		$scope.selectOption(sideNavOptions[0]);
	});

	$scope.$on('user:unset', function(event){
  		$scope.user = null;
   });

	AuthService.currentUser().then(function(user){
		$scope.user = user;
	});

	$scope.selectOption = function(option){
		$scope.selected = angular.isNumber(option)? $scope.sideNavOptions[option] : option;
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
		});
	};

	$scope.microCombos = function(){
		Combo.loadMicroCombos().then(function(microCombos){
			$scope.combos = microCombos;
		});
	};

	$scope.mediumCombos = function(){
		Combo.loadMediumCombos().then(function(mediumCombos){
			$scope.combos = mediumCombos;
		});
	};

	$scope.megaCombos = function(){
		Combo.loadMegaCombos().then(function(megaCombos){
			$scope.combos = megaCombos;
		});
	};

	// $scope.addToCart = function(combo){
	// 	if($scope.user){
	// 		CartService.addToCart(combo).then(function(){
	// 			toaster.pop('success', 'added the combo to cart!');
	// 		});
	// 	}else{
	// 		$location.path('/login');
	// 		toaster.pop('warning', '', 'You need to be logged in first!');
	// 	}
	// };

}]);