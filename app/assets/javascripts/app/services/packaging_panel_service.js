'use strict';

angular.module('foodmashApp.services')

.service('PackagingPanelService', ['$rootScope', '$q', 'PackagingCentre', function($rootScope, $q, PackagingCentre) {
  
   var service = this;
   service.packaging_centre = {};
   service.cart = {};

   this.getCartsForPanel = function(role){
      var d = $q.defer();
      if(!service.packaging_centre.name){
        PackagingCentre.query({id: role.resource.id}).then(function(packaging_centres){
           if(packaging_centres && packaging_centres.length > 0){
             service.packaging_centre = packaging_centres[0];

             service.packaging_centre.getCartsForCentre().then(function(carts){
               if(carts && carts.length > 0){
                 service.packaging_centre.carts = carts;
               }else{
                 service.packaging_centre.carts = null;
               }
               d.resolve(service.packaging_centre);
             }, function(err){
               service.packaging_centre.carts = null;
               d.reject(service.packaging_centre);
             });

           }else{
            service.packaging_centre.carts = null;
             service.packaging_centre = null;
             d.reject(service.packaging_centre);
           }
        });
      }else{
        d.resolve(service.packaging_centre);
      }
      return d.promise;
   };

   this.loadCartsForPanel = function(){
      var d = $q.defer();
      PackagingCentre.query({id: role.resource.id}).then(function(packaging_centres){
         if(packaging_centres && packaging_centres.length > 0){
           service.packaging_centre = packaging_centres[0];

           service.packaging_centre.getCartsForCentre().then(function(carts){
             if(carts && carts.length > 0){
               service.packaging_centre.carts = carts;
             }else{
               service.packaging_centre.carts = null;
             }
             d.resolve(service.packaging_centre);
           }, function(err){
             service.packaging_centre.carts = null;
             d.reject(service.packaging_centre);
           });

         }else{
          service.packaging_centre.carts = null;
           service.packaging_centre = null;
           d.reject(service.packaging_centre);
         }
      });
      return d.promise;
   };
   
   this.setPackagingCentreOrder = function(cart){
      service.cart = cart;
   };

   this.getPackagingCentreOrder = function(){
      var d = $q.defer();
      if(service.cart){
        d.resolve(service.cart);
      }else{
        d.reject(service.cart);      
      }
      return d.promise;
   };
   
 }]);