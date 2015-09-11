'use strict';

angular.module('foodmashApp.controllers')

.controller('PanelController', ['$scope','$location','toaster','$rootScope', function($scope, $location, toaster, $rootScope){

  $scope.routeToCombos = function(){
    $location.path("/combos");
  };

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