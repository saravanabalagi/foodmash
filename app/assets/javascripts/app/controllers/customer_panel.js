'use strict';

angular.module('foodmashApp.controllers')

.controller('CustomerPanelController', ['$scope','$location','toaster','$rootScope','Cart', 'CustomerPanelService', '$filter', function($scope, $location, toaster, $rootScope, Cart, CustomerPanelService, $filter){

	$scope.carts = [];
	$scope.selectedCart = {};
	$scope.selectedStatus = {};
	$scope.loadingCarts = true;
	$scope.customerPanelOptions = [
		{name: 'Current', icon_class: 'fa fa-inbox pull-right'},
		{name: 'Delivered', icon_class: 'fa fa-archive pull-right'}
	];
	$scope.statuses = [
		{name: "purchased", alias: "Placed Order", icon_class: "fa fa-clock-o", percent: 'width:0%'},
		{name: "ordered", alias: "Being Aggregated", icon_class: "fa fa-dropbox", percent: 'width:35%'},
		{name: "dispatched", alias: "Dispatched for Delivery", icon_class: "fa fa-truck", percent: 'width:65%'},
		{name: "delivered", alias: "Delivered", icon_class: "fa fa-check-circle", percent: 'width:100%'}
	];

	CustomerPanelService.getCartsForCustomer().then(function(carts){
		if(carts.length > 0){
			$scope.loadedCarts = carts;
			$scope.carts = carts;
		}else{
			$scope.loadedCarts = null;
			$scope.carts = null;
		}
		$scope.loadingCarts = false;
	}, function(err){
		$scope.loadedCarts = null;
		$scope.carts = null;
		$scope.loadingCarts = false;
	});

	$scope.load = function(){
      angular.element(document).ready(function(){
        new WOW().init();
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
      });
    };

    $scope.selectOption = function(option){
    	$scope.selectedOption = option;
    	switch(option.name){
    		case 'Current': 
    			var deliveredCarts = $filter('filter')($scope.loadedCarts, {aasm_state: 'delivered'}, true);
    			$scope.carts = $scope.loadedCarts;
    			deliveredCarts.filter(function(cart){
    				var index = $scope.carts.indexOf(cart);
    				$scope.carts.splice(index, 1);
    			});
    		break;
    		case 'Delivered': 
    			$scope.carts = $filter('filter')($scope.loadedCarts, {aasm_state: 'delivered'}, true);
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

	$scope.calculateOrderPrice = function(order){
		var price = 0.0;
		order.order_items.filter(function(oi){
			price += oi.quantity * oi.item.price * order.quantity;
		});
		return price;
	};

	function getSuitableStatus(status){
		$scope.statuses.filter(function(s){
			if(s.name == status){
				$scope.selectedStatus = s;
			}
		});
	};

}]);