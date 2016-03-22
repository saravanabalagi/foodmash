'use strict';

angular.module('foodmashApp.services')

.service('ComboService', ['$rootScope', '$q', 'Restaurant', 'DishType', function($rootScope, $q, Restaurant, DishType) {
  
   var service = this;
   service.restaurants = [];
   service.dish_types = [];
   service.packaging_centre_id = 0;

   this.getRestaurantsForCombo = function(packaging_centre_id){
      var d = $q.defer();
      if(!service.restaurants.length && service.packaging_centre_id !== packaging_centre_id){
        Restaurant.query({packaging_centre_id: packaging_centre_id}).then(function(restaurants){
          if(restaurants.length > 0){
            service.restaurants = restaurants;
            d.resolve(service.restaurants);
          }else{
            service.restaurants = null;
            d.reject(service.restaurants);
          }
            service.packaging_centre_id = packaging_centre_id;
          }, function(err){
            service.restaurants = null;
            d.reject(service.restaurants);
            service.packaging_centre_id = packaging_centre_id;
        });
      }else{
        d.resolve(service.restaurants);
        service.packaging_centre_id = packaging_centre_id;
      }
      return d.promise;
    };

    this.getDishTypesForCombo = function(){
      var d = $q.defer();
      if(!service.dish_types.length){
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