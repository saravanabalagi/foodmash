'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantPanelController', ['$scope','$location','toaster','$rootScope','Restaurant', function($scope, $location, toaster, $rootScope, Restaurant){

	$scope.user = $rootScope.currentUser;
	$scope.roles = $rootScope.currentUser.roles;

	$scope.roles.filter(function(role){
		if(role.name == "restaurant_admin"){
			Restaurant.query({id: role.resource.id}).then(function(restaurants){
				if(restaurants.length > 0){
					$scope.restaurant = restaurants[0];
				}else{
					$scope.restaurant = null;
				}
			});
		}
	});

}]);