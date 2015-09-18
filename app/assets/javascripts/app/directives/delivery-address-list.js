'use strict';

angular.module('foodmashApp.directives')

.directive('deliveryAddressList', ['DeliveryAddress', '$q', 'toaster','$rootScope', function(DeliveryAddress, $q, toaster, $rootScope){

	return {

		restrict: 'E',

		templateUrl: '/templates/delivery-address-list.html',

		controller: ['$scope', 'DeliveryAddress', '$q', 'toaster', '$rootScope', function($scope, DeliveryAddress, $q, toaster, $rootScope){

			$scope.updatedDeliveryAddress = new DeliveryAddress;

			$scope.setUpdate = function(delivery_address){
				$scope.updatedDeliveryAddress = angular.copy(delivery_address);
			};

			$scope.updateDeliveryAddress = function(delivery_address, updateCross){
				var d = $q.defer();
				if(!updateCross){
					if(!$scope.deliveryAddressUpdateForm.$pristine){
						$scope.updatedDeliveryAddress.update().then(function(response){
							toaster.pop('success', 'Delivery Address was updated!');
							var index = $scope.delivery_addresses.indexOf(delivery_address);
							if(angular.isNumber(index)){
								refreshDeliveryAddresses();
							}
							d.resolve(response);
						}, function(err){
							toaster.pop('error', 'Delivery Address was not updated!');
							d.reject(err);
						});
					}else{
						$scope.updatedDeliveryAddress = new DeliveryAddress;
						d.resolve(null);
					}
				}
				return d.promise;
			};

			$scope.deleteDeliveryAddress = function(delivery_address){
				var d = $q.defer();
				delivery_address.delete().then(function(response){
					toaster.pop('success', 'Delivery Address was deleted!');
					$scope.delivery_addresses.splice($scope.delivery_addresses.indexOf(delivery_address), 1);
					refreshDeliveryAddresses();
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Delivery Address was not deleted!');
					d.reject(err);
				});
			};

			function refreshDeliveryAddresses(){
				DeliveryAddress.query({user_id: $rootScope.currentUser.id}).then(function(delivery_addresses){
					if(delivery_addresses.length > 0){
						$scope.delivery_addresses = delivery_addresses;
					}else{
						$scope.delivery_addresses = null;
					}
				}, function(err){
					$scope.delivery_addresses = null;
				});
			};
		}]
	};
}]);