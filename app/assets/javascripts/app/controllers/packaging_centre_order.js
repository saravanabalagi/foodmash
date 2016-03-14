'use strict';

angular.module('foodmashApp.controllers')

.controller('PackagingCentreOrderController', ['$scope','$interval','$location','toaster','$rootScope', 'PackagingCentre', '$filter', 'PackagingPanelService', '$q', 'Cart', function($scope, $interval, $location, toaster, $rootScope, PackagingCentre, $filter, PackagingPanelService, $q, Cart){

	$scope.cart = {};
	$scope.selectedStatus = {};
	$scope.next_status = {};
    $scope.elapsedTime = "";
    $scope.timer = null;
    $scope.packagingOrderOptions = [
		{name: 'Current', icon_class: 'fa fa-inbox pull-right', checkout: 'Delivered'},
		{name: 'Delivered', icon_class: 'fa fa-archive pull-right', checkout: 'Current'}
	];
	$scope.packaging_centre_orders = [];

	$scope.statuses = [
		{name: "purchased", alias: "Placed Order", icon_class: "fa fa-clock-o", percent: 'width:15%'},
		{name: "ordered", alias: "Being Aggregated", icon_class: "fa fa-dropbox", percent: 'width:45%'},
		{name: "dispatched", alias: "Dispatched for Delivery", icon_class: "fa fa-truck", percent: 'width:80%'},
		{name: "delivered", alias: "Delivered", icon_class: "fa fa-check-circle", percent: 'width:100%'}
	];

	PackagingPanelService.getPackagingCentreOrder().then(function(cart){
		$scope.cart = cart;
        console.log($scope.cart);
        findNextStatus($scope.cart.aasm_state);
        aggregatePackagingCentreOrders();
        if(cart.aasm_state!='delivered'){
        	findElapsedTime(new Date());
            $scope.timer=$interval(function(){ findElapsedTime(new Date()) }, 1000);
        }else{
        	findElapsedTime(cart.delivered_at);
        }
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
		if($scope.statuses.indexOf(status) <= $scope.statuses.indexOf(getSuitableStatus($scope.cart.aasm_state))){
			return true;
		}
		return false;
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

	$scope.updateStatus = function(){
		var d = $q.defer();
		$rootScope.addLoader('.order-status-update-wrapper', '', 'red');
		Cart.changeStatus($scope.next_status.name, $scope.cart.id).then(function(cart){
			toaster.pop('success', 'Cart status was successfully updated!');
			$scope.cart = cart;
			PackagingPanelService.setUpdatedCart(cart);
			$rootScope.removeLoader('.order-status-update-wrapper');
			findNextStatus($scope.cart.aasm_state);
			d.resolve(cart);
		}, function(err){
			toaster.pop('error', 'Cart status was not updated!');
			$rootScope.removeLoader('.order-status-update-wrapper');
			d.reject(err);
		});
        checkAndkillTimer();
		return d.promise;
	};

    $scope.killTimer = function(){
        if($scope.timer!=null && $scope.cart.aasm_state=='delivered') {
            $interval.cancel($scope.timer);
            $scope.timer=undefined;
        }
    };

	function findNextStatus(cart_status){
		$scope.statuses.filter(function(status){
			if(status.name == cart_status){
				var index = $scope.statuses.indexOf(status);
				$scope.next_status = $scope.statuses[index + 1];
			}
		});
	}

	function getSuitableStatus(status){
		var get_status  = {};
		$scope.statuses.filter(function(s){
			if(s.name == status){
				get_status = s;
			}
		});
		return get_status;
	}

	function aggregatePackagingCentreOrders(){
		if($scope.cart && $scope.cart.orders && $scope.cart.orders.length > 0){
			$scope.cart.orders.filter(function(order){
				order.order_items.filter(function(order_item){
					$scope.packaging_centre_orders.push(order_item);
				});
			});
		}
	}

    function findElapsedTime(time){
        var now = time;
        var purchased_at = new Date($scope.cart.purchased_at);
        var diff = Math.abs(now.getTime() - purchased_at.getTime())/1000;
        var diffSecs = Math.floor(diff % 60);
        var diffMins = Math.floor(diff / 60);
        var diffHours;
        if(parseInt(diffMins)>0) {
            diffHours = Math.floor(diffMins / 60);
            diffMins = diffMins % 60;
            diffHours = (diffHours < 10) ? "0" + diffHours : diffHours;
        }
        diffMins = (diffMins < 10) ? "0" + diffMins : diffMins;
        diffSecs = (diffSecs < 10) ? "0" + diffSecs : diffSecs;
        $scope.elapsedTime = ((diff===undefined)?"":(diffHours+":"))+diffMins + ":" + diffSecs;
    }

}]);