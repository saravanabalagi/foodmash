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
    $location.path("/dishTypes");
  };

  $scope.routeToUserRoles = function(){
    $location.path("/userRoles");
  };

  $scope.routeToCuisines = function(){
    $location.path("/cuisines");
  };

   $scope.routeToCities = function(){
    $location.path("/cities");
  };

  $scope.routeToPackagingCentres = function(){
    $location.path("/packagingCentres");
  };  

}]);