'use strict';

angular.module('foodmashApp.services')

.service('MainService', ['$rootScope', '$q', function($rootScope, $q) {
  
   var service = this;
   service.selectedSortOption = null;
   service.selected = [];

   service.sortOptions = [
   	{name: 'Low to High', icon_class: 'fa fa-sort-amount-asc pull-right', reverse: false},
   	{name: 'High to Low', icon_class: 'fa fa-sort-amount-desc pull-right', reverse: true}
   ];

   service.mainOptions = 
   [
   	{name: "Regular", icon_class: "fa fa-cutlery pull-right", alias: 'Regular'},
   	{name: "Budget", icon_class: "fa fa-coffee pull-right", alias: 'Budget'},
   	{name: "Corporate", icon_class: "fa fa-sitemap pull-right", alias: 'Corporate'},
   	{name: "Health", icon_class: "fa fa-heartbeat pull-right", alias: 'Health'}
   ];

   service.sizeOptions = 
   [
      {name: "Micro", icon_class: "icon-user1 pull-right", style: "", alias: 1},
      {name: "Medium", icon_class: "icon-user2 pull-right", style: "font-size: 18px; margin-top: -3px;", alias: 2},
      {name: "Mega", icon_class: "icon-user3 pull-right", style: "font-size: 25px; padding: 0; margin-top: -5px;", alias: 3}
   ];

   service.preferenceOptions = 
   [
   	{name: "Veg", icon_class: "fa fa-leaf pull-right", alias: 'veg'},
   	{name: "Egg", icon_class: "icon-egg pull-right", alias: 'egg'},
   	{name: "Non Veg", icon_class: "icon-meat pull-right", alias: 'non-veg'}
   ];

   service.getSortOptions = function(){
   		return service.sortOptions;
   };

   service.getMainOptions = function(){
   		return service.mainOptions;
   };

   service.getSizeOptions = function(){
   		return service.sizeOptions;
   };

   service.getPreferenceOptions = function(){
   		return service.preferenceOptions;
   };
   
   service.setSelectedSortOption = function(selectedSortOption){
   		service.selectedSortOption = selectedSortOption || service.sortOptions[0];
   };

   service.getSelectedSortOption = function(){
   		return service.selectedSortOption;
   };

   service.setSelectedSet = function(selected){
   		service.selected = selected;
   };

   service.getSelectedSet = function(){
   		return service.selected;
   };

   service.setSelectedSortOption(service.sortOptions[0]);

 }]);