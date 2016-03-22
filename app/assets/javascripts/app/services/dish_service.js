'use strict';

angular.module('foodmashApp.services')

.service('DishService', ['$rootScope', '$q', 'Cuisine', 'DishType', function($rootScope, $q, Cuisine, DishType) {
  
   var service = this;
   service.cuisines = [];
   service.dish_types = [];

   this.getCuisinesForDish = function(){
      var d = $q.defer();
      if(!service.cuisines.length){
        console.log('querying for cuisines');
        Cuisine.query().then(function(cuisines){
          if(cuisines.length > 0){
            service.cuisines = cuisines;
            d.resolve(service.cuisines);
          }else{
            service.cuisines = null;
            d.reject(service.cuisines);
          }
          }, function(err){
            service.cuisines = null;
            d.reject(service.cuisines);
        });
      }else{
        d.resolve(service.cuisines);
      }
      return d.promise;
    };

    this.getDishTypesForDish = function(){
      var d = $q.defer();
      if(!service.dish_types.length){
        console.log('querying for dish types');
        DishType.query().then(function(dish_types){
          if(dish_types.length > 0){
            service.dish_types = dish_types;
            d.resolve(service.dish_types);
          }else{
            service.dish_types = null;
            d.reject(service.dish_types);
          }
          }, function(err){
            service.dish_types = null;
            d.reject(service.dish_types);
        });
      }else{
        d.resolve(service.dish_types);
      }
      return d.promise;
    };
   
 }]);