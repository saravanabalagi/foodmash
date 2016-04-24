'use strict';

angular.module('foodmashApp.services')

.service('PackagingPanelService', ['$rootScope', '$q', 'PackagingCentre', function($rootScope, $q, PackagingCentre) {
  
   var service = this;
   service.packaging_centre = {};
   service.cart = {};
   service.packagingPanelOptions = [
    {name: 'Current', icon_class: 'fa fa-inbox pull-right', checkout: 'Delivered'},
    {name: 'Delivered', icon_class: 'fa fa-archive pull-right', checkout: 'Current'}
  ];
  service.selectedPackagingPanelOption = null;

  service.statuses = [
    {name: "purchased", alias: "Incoming Order", icon_class: "fa fa-clock-o", percent: 'width:15%'},
    {name: "ordered", alias: "Placed Order with Restaurants", icon_class: "fa fa-dropbox", percent: 'width:45%'},
    {name: "dispatched", alias: "Dispatched for Delivery", icon_class: "fa fa-truck", percent: 'width:75%'},
    {name: "delivered", alias: "Delivered", icon_class: "fa fa-check-circle", percent: 'width:100%'}
  ];

  service.sortOptions = [
    {name: 'Newest First', icon_class: 'fa fa-sort-amount-asc pull-right', reverse: true},
    {name: 'Oldest First', icon_class: 'fa fa-sort-amount-desc pull-right', reverse: false}
  ];
  service.selectedSortOption = null;

  service.getPackagingPanelSortOptions = function(){
    return service.sortOptions;
  };

  service.getPackagingPanelStatuses = function(){
    return service.statuses;
  };

  service.getPackagingPanelOptions = function(){
    return service.packagingPanelOptions;
  };

  service.setSelectedPackagingPanelOption = function(selectedPackagingPanelOption){
    service.selectedPackagingPanelOption = selectedPackagingPanelOption || service.packagingPanelOptions[0];
  };

  service.getSelectedPackagingPanelOption = function(selectedPackagingPanelOption){
      return service.selectedPackagingPanelOption;
  };

  service.setSelectedSortOption = function(selectedSortOption){
    service.selectedSortOption = selectedSortOption || service.sortOptions[0];
  };

  service.getSelectedSortOption = function(selectedSortOption){
      return service.selectedSortOption;
  };

  service.setSelectedPackagingPanelOption(service.packagingPanelOptions[0]);
  service.setSelectedSortOption(service.sortOptions[0]);

   service.getCartsForPanel = function(role){
      var d = $q.defer();
      if(service.packaging_centre && !service.packaging_centre.name){
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

   service.loadCartsForPanel = function(role){
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
   
   service.setPackagingCentreOrder = function(cart){
      service.cart = cart;
   };

   service.setUpdatedCart = function(cart){
      if(service.packaging_centre && service.packaging_centre.carts && service.packaging_centre.carts.length > 0){
        service.packaging_centre.carts.filter(function(c){
          if(c.id == cart.id){
            var index = service.packaging_centre.carts.indexOf(c);
            service.packaging_centre.carts[index] = cart;
          }
        });
      }
   };

   service.getPackagingCentreOrder = function(){
      var d = $q.defer();
      if(service.cart){
        d.resolve(service.cart);
      }else{
        d.reject(service.cart);      
      }
      return d.promise;
   };
   
 }]);