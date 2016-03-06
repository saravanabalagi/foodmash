'use strict';

angular.module('foodmashApp.services')

.service('PackagingPanelService', ['$rootScope', '$q', 'PackagingCentre', function($rootScope, $q, PackagingCentre) {
  
   var service = this;
   service.packaging_centre = {};
   service.cart = {};

   this.getCartsForPanel = function(role){
      var d = $q.defer();
      console.log('inside get');
      if(!service.packaging_centre.name){
        console.log('loading new in get');
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
            console.log('loading old in get');
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

   this.loadCartsForPanel = function(role){
      var d = $q.defer();
      console.log('inside load');
      PackagingCentre.query({id: role.resource.id}).then(function(packaging_centres){
         if(packaging_centres && packaging_centres.length > 0){
          console.log('loading new in load');
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
          console.log('loading null in load');
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

   this.setUpdatedCart = function(cart){
      if(service.packaging_centre && service.packaging_centre.carts && service.packaging_centre.carts.length > 0){
        service.packaging_centre.carts.filter(function(c){
          if(c.id == cart.id){
            var index = service.packaging_centre.carts.indexOf(c);
            service.packaging_centre.carts[index] = cart;
          }
        });
      }
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