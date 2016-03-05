'use strict';

angular.module('foodmashApp.services')

.service('PackagingPanelService', ['$rootScope', '$q', function($rootScope, $q) {
  
   var service = this;
   service.cart = {};
   
   this.getPackagingCentreOrder = function(cart) {
      service.cart = cart;
   };

   this.setPackagingCentreOrder = function(){
      var d = $q.defer();
      if(service.cart){
        d.resolve(service.cart);
      }else{
        d.reject(service.cart);      
      }
      return d.promise;
   };
   
 }]);