'use strict';

angular.module('foodmashApp.controllers')

.controller('PanelController', ['$scope','AuthService','$location','toaster', function($scope, AuthService, $location, toaster){

  $scope.routeToCombos = function(){
    $location.path("/combos");
  };

  AuthService.getCurrentUser().then(function(user){
    console.log(user);
  });

  $scope.routeToRestaurants = function(){
    $location.path("/restaurants");
  };

  $scope.routeToDishTypes = function(){
    $location.path("/dish_types");
  };

  $scope.routeToUserRoles = function(){
    $location.path("/user_roles");
  };

  $scope.routeToCuisines = function(){
    $location.path("/cuisines");
  };

}]);