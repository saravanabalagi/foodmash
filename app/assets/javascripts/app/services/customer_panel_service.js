'use strict';

angular.module('foodmashApp.services')

.service('CustomerPanelService', ['$rootScope', '$q', 'Cart', function($rootScope, $q, Cart) {
  
   var service = this;
   service.carts = [];

   service.getCartsForCustomer = function(){
      var d = $q.defer();
      if(service.carts && !service.carts.length){
        Cart.query({user_id: $rootScope.currentUser.id}).then(function(carts){
          if(carts.length > 0){
            service.carts = carts;
            d.resolve(service.carts);
          }else{
            service.carts = null;
            d.reject(service.carts);
          }
          }, function(err){
            service.carts = null;
            d.reject(service.carts);
        });
      }else{
        d.resolve(service.carts);
      }
      return d.promise;
    };
   
   service.setCarts= function(carts){
      service.carts = carts;
   };

   service.loadCartsForCustomer = function(){
      var d = $q.defer();
      Cart.query({user_id: $rootScope.currentUser.id}).then(function(carts){
        if(carts.length > 0){
          service.carts = carts;
          d.resolve(service.carts);
        }else{
          service.carts = null;
          d.reject(service.carts);
        }
        }, function(err){
          service.carts = null;
          d.reject(service.carts);
      });
      return d.promise;
   };

 }]);