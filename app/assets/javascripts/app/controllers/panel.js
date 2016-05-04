'use strict';

angular.module('foodmashApp.controllers')

.controller('PanelController', ['$scope','$location','toaster','$rootScope', function($scope, $location, toaster, $rootScope){

  $scope.selected = "";
  $scope.loadCombos = false;
  $scope.loadRestaurants = false;
  $scope.loadDishTypes = false;
  $scope.loadCuisines = false;
  $scope.loadPackagingCentres = false;
  $scope.loadCities = false;
  $scope.loadPromos = false;
  $scope.loadVersions = false;

  $scope.panelOptions = [
    {name: "Combos", alias: "Combos", icon_class: "fa fa-shopping-bag pull-right"},
    {name: "Restaurants", alias: "Restaurants", icon_class: "fa fa-cutlery pull-right"},
    {name: "Food Types", alias: "DishTypes", icon_class: "icon-meat pull-right"},
    {name: "Cuisines", alias: "Cuisines", icon_class: "fa fa-flag pull-right"},
    {name: "Centres", alias: "PackagingCentres", icon_class: "fa fa-cube pull-right"},
    {name: "Cities", alias: "Cities", icon_class: "fa fa-cubes pull-right"},
    {name: "Promos", alias: "Promos", icon_class: "fa fa-beer pull-right"},
    {name: "Versions", alias: "Versions", icon_class: "fa fa-code-fork pull-right"},
    {name: "Users", alias: "UserRoles", icon_class: "fa fa-user pull-right"}
  ];

  $scope.loadData = function(){
    if($scope.selected){
      switch($scope.selected){
        case "Combos": 
        $scope.loadCombos = true;
        break;
        case "Restaurants": 
        $scope.loadRestaurants = true;
        break;
        case "DishTypes": 
        $scope.loadDishTypes = true;
        break;
        case "Cuisines": 
        $scope.loadCuisines = true;
        break;
        case "PackagingCentres": 
        $scope.loadPackagingCentres = true;
        break;
        case "Cities": 
        $scope.loadCities = true;
        break;
        case "Promos": 
        $scope.loadPromos = true;
        break;
        case "Versions":
        $scope.loadVersions = true
        break;
      };
    }
  };

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