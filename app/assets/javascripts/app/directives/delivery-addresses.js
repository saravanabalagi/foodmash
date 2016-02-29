'use strict';

angular.module('foodmashApp.directives')

.directive('deliveryAddresses', ['DeliveryAddress', '$q', 'toaster','$rootScope', function(DeliveryAddress, $q, toaster, $rootScope){

	return {

		restrict: 'E',

		templateUrl: '/templates/delivery_addresses.html',

		controller: ['$scope', 'DeliveryAddress', '$q', 'toaster', '$rootScope', function($scope, DeliveryAddress, $q, toaster, $rootScope){

			$scope.delivery_addresses = [];
			$scope.delivery_address = new DeliveryAddress;
			$scope.loadingDeliveryAddresses = true;

			if($rootScope.currentUser && !$rootScope.delivery_addresses){
				DeliveryAddress.query({user_id: $rootScope.currentUser.id, area_id: $rootScope.area.id}).then(function(delivery_addresses){
					if(delivery_addresses.length > 0){
						$scope.delivery_addresses = delivery_addresses;
						$rootScope.delivery_addresses = delivery_addresses;
					}else{
						$scope.delivery_addresses = new Array;
						$rootScope.delivery_addresses = null;
					}
					$scope.loadingDeliveryAddresses = false;
				}, function(err){
					$scope.delivery_addresses = null;
					$scope.loadingDeliveryAddresses = false;
				});
			}else{
				if($rootScope.delivery_addresses){
					$scope.delivery_addresses = $rootScope.delivery_addresses;
				}else{
					$scope.delivery_addresses = null;
				}
			}

			$scope.addDeliveryAddress = function(){
				var d = $q.defer();
				$scope.delivery_address.area_id = $rootScope.area.id;
				$scope.delivery_address.save().then(function(response){
					toaster.pop('success', 'Delivery Address was created!');
					$scope.delivery_addresses.push($scope.delivery_address);
					$scope.delivery_address = new DeliveryAddress;
					$scope.reload();
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Delivery Address was not created!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.reload = function(){
				var d = $q.defer();
				DeliveryAddress.query({user_id: $rootScope.currentUser.id, area_id: $rootScope.area.id}).then(function(delivery_addresses){
				if(delivery_addresses.length > 0){
					$scope.delivery_addresses = delivery_addresses;
					$rootScope.delivery_addresses = delivery_addresses;
					d.resolve(null);
				}else{
					$scope.delivery_addresses = new Array;
					$rootScope.delivery_addresses = null;
					d.resolve(null);
				}
			}, function(err){
				$scope.delivery_addresses = null;
				d.reject(err);
			});
				return d.promise;
			};

		}]
	};
}]);