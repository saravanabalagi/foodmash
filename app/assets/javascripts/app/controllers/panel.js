'use strict';

angular.module('foodmashApp.controllers')

.controller('PanelController', ['$scope','AuthService','$location', function($scope, AuthService, $location){


  $scope.routeToCombos = function(){
  	$location.path("/combo");
  };

  $scope.routeToRestaurants = function(){
  	$location.path("/restaurant");
  };

  $scope.routeToDishTypes = function(){
  	$location.path("/dish_type");
  };

  $scope.routeToUserRoles = function(){
  	$location.path("/user_role");
  };

}]);