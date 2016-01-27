'use strict';

angular.module('foodmashApp.controllers')

.controller('PanelController', ['$scope','$location','toaster','$rootScope', function($scope, $location, toaster, $rootScope){

  $scope.selected = "";

  $scope.panelOptions = [
    {name: "Combos", alias: "Combos", icon_class: "fa fa-shopping-bag pull-right"},
    {name: "Restaurants", alias: "Restaurants", icon_class: "fa fa-cutlery pull-right"},
    {name: "Food Types", alias: "DishTypes", icon_class: "icon-meat pull-right"},
    {name: "Cuisines", alias: "Cuisines", icon_class: "fa fa-flag pull-right"},
    {name: "Centres", alias: "PackagingCentres", icon_class: "fa fa-cube pull-right"},
    {name: "Cities", alias: "Cities", icon_class: "fa fa-cubes pull-right"},
    {name: "Users", alias: "UserRoles", icon_class: "fa fa-user pull-right"}
  ];

  $scope.selectPanelOption = function(option){
    if($scope.checkIfSelected(option)){
      $scope.selected = "";
    }else{
      $scope.selected = option;
    }
  };

  $scope.checkIfSelected = function(option){
    if($scope.selected == option){
      return true;
    }
    return false;
  };

}]);