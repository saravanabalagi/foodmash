'use strict';

angular.module('foodmashApp.directives')

.directive('deliveryAddressList', ['DeliveryAddress', '$q', 'toaster','$rootScope', function(DeliveryAddress, $q, toaster, $rootScope){

	return {

		restrict: 'A',

		templateUrl: '/templates/delivery-address-list.html',

		controller: ['$scope', 'DeliveryAddress', '$q', 'toaster', '$rootScope', function($scope, DeliveryAddress, $q, toaster, $rootScope){

			$scope.updatedDeliveryAddress = new DeliveryAddress;

			$scope.setUpdate = function(delivery_address){
				$scope.updatedDeliveryAddress = angular.copy(delivery_address);
			};

			$scope.updateDeliveryAddress = function(delivery_address, updateCross){
				var d = $q.defer();
				$scope.updatedDeliveryAddress.update().then(function(response){
					toaster.pop('success', 'Delivery Address was updated!');
					var index = $scope.delivery_addresses.indexOf(delivery_address);
					if(angular.isNumber(index) && index >= 0){
						$scope.reload();
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Delivery Address was not updated!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.deleteDeliveryAddress = function(delivery_address){
				var d = $q.defer();
				delivery_address.delete().then(function(response){
					toaster.pop('success', 'Delivery Address was deleted!');
					$scope.delivery_addresses.splice($scope.delivery_addresses.indexOf(delivery_address), 1);
					$scope.reload();
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Delivery Address was not deleted!');
					d.reject(err);
				});
			};

		}]
	};
}]);