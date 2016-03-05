'use strict';

angular.module('foodmashApp.controllers')

.controller('PackagingCentreOrderController', ['$scope','$location','toaster','$rootScope', 'PackagingCentre', '$filter', 'PackagingPanelService', function($scope, $location, toaster, $rootScope, PackagingCentre, $filter, PackagingPanelService){

	$scope.cart = {};
	$scope.selectedStatus = {};
	$scope.packagingOrderOptions = [
		{name: 'Current', icon_class: 'fa fa-inbox pull-right', checkout: 'Delivered'},
		{name: 'Delivered', icon_class: 'fa fa-archive pull-right', checkout: 'Current'}
	];

	$scope.statuses = [
		{name: "purchased", alias: "Placed Order", icon_class: "fa fa-clock-o", percent: 'width:0%'},
		{name: "ordered", alias: "Being Aggregated", icon_class: "fa fa-dropbox", percent: 'width:35%'},
		{name: "dispatched", alias: "Dispatched for Delivery", icon_class: "fa fa-truck", percent: 'width:65%'},
		{name: "delivered", alias: "Delivered", icon_class: "fa fa-check-circle", percent: 'width:100%'}
	];

	$scope.sortOptions = [
		{name: 'Newest First', icon_class: 'fa fa-sort-amount-asc pull-right', reverse: true},
		{name: 'Oldest First', icon_class: 'fa fa-sort-amount-desc pull-right', reverse: false}
	];
	$scope.selectedSortOption = $scope.sortOptions[1];

	PackagingPanelService.getPackagingCentreOrder().then(function(cart){
		$scope.cart = cart;
	}, function(err){
		$scope.cart = null;
	});

	$scope.routeToPackagingCentrePanelOrder = function(cart){
		PackagingPanelService.setCartForOrderPage(cart);
		$location.path('/packagingCentrePanel/Order');
	};

	$scope.load = function(){
	    angular.element(document).ready(function (){
	      new WOW().init();
	      $('[data-toggle="tooltip"]').tooltip();
	      $('[data-toggle="popover"]').popover();
	    });
	 };

	 $scope.selectSortOption = function(option){
	 	$scope.selectedSortOption = option;
	 	var orderBy = $filter('orderBy');
	 	if($scope.selectedSortOption){
	 		$scope.carts = orderBy($scope.carts, 'updated_at', option.reverse);
	 	}
	 };

	 $scope.checkIfSortOptionSelected = function(option){
	 	if(option == $scope.selectedSortOption){
	 		return true;
	 	};
	 	return false;
	 };

	 $scope.selectOption = function(option){
	 	$scope.selectedOption = option;
	 	switch(option.name){
	 		case 'Current': 
	 		if($scope.loadedCarts){
	 			var deliveredCarts = $filter('filter')($scope.loadedCarts, {aasm_state: 'delivered'}, true);
	 			$scope.carts = $scope.loadedCarts;
	 			deliveredCarts.filter(function(cart){
	 				var index = $scope.carts.indexOf(cart);
	 				$scope.carts.splice(index, 1);
	 			});
	 		}
	 		break;
	 		case 'Delivered': 
	 		if($scope.loadedCarts){
	 			$scope.carts = $filter('filter')($scope.loadedCarts, {aasm_state: 'delivered'}, true);
	 		}
	 		break;
	 	};
	 };

	 $scope.checkIfSelected = function(option){
	 	if(option == $scope.selectedOption){
	 		return true;
	 	}
	 	return false;
	 };

	$scope.checkIfCompleted = function(status){
		if($scope.statuses.indexOf(status) <= $scope.statuses.indexOf($scope.selectedStatus)){
			return true;
		}
		return false;
	};

	$scope.selectCart = function(cart){
		$scope.selectedCart = cart;
		getSuitableStatus(cart.aasm_state);
	};

	$scope.getStatusIcon = function(status){
		var icon_class = '';
		$scope.statuses.filter(function(s){
			if(s.name == status){
				icon_class = 'fa fa-fw ' + s.icon_class.split(" ")[1];
				return icon_class;
			}
		});
		return icon_class;
	};

	$scope.getStatusAlias = function(status){
		var alias = '';
		$scope.statuses.filter(function(s){
			if(s.name == status){
				alias = s.alias;
				return alias;
			}
		});
		return alias;
	};

	$scope.getStatusPercent = function(status){
		var percent = '';
		$scope.statuses.filter(function(s){
			if(s.name == status){
				percent = s.percent;
				return percent;
			}
		});
		return percent;
	};

	function getSuitableStatus(status){
		$scope.statuses.filter(function(s){
			if(s.name == status){
				$scope.selectedStatus = s;
			}
		});
	};

}]);