'use strict';

angular.module('foodmashApp.services')

.service('CustomerPanelService', ['$rootScope', '$q', 'Cart', function($rootScope, $q, Cart) {
  
   var service = this;
   service.carts = [];
   service.selectedCustomerPanelOption = null;
   service.selectedCustomerPanelSortOption = null;
   service.selectedCustomerPanelCart = null;
   service.customerPanelOptions = [
    {name: 'Current', icon_class: 'fa fa-inbox pull-right', checkout: 'Delivered'},
    {name: 'Delivered', icon_class: 'fa fa-archive pull-right', checkout: 'Current'}
  ];

  service.sortOptions = [
    {name: 'Newest First', icon_class: 'fa fa-sort-amount-asc pull-right', reverse: true},
    {name: 'Oldest First', icon_class: 'fa fa-sort-amount-desc pull-right', reverse: false}
  ];

  service.statuses = [
    {name: "purchased", alias: "Placed Order", icon_class: "fa fa-clock-o", percent: 'width:15%'},
    {name: "ordered", alias: "Being Aggregated", icon_class: "fa fa-dropbox", percent: 'width:45%'},
    {name: "dispatched", alias: "Dispatched for Delivery", icon_class: "fa fa-truck", percent: 'width:75%'},
    {name: "delivered", alias: "Delivered", icon_class: "fa fa-check-circle", percent: 'width:100%'}
  ];

  service.getSelectedCustomerPanelCart = function(){
      return service.selectedCustomerPanelCart;
  };

  service.setSelectedCustomerPanelCart = function(selectedCart){
      service.selectedCustomerPanelCart = selectedCart;
  };  

  service.getCustomerPanelOptions = function(){
      return service.customerPanelOptions;
  };

  service.getCustomerPanelSortOptions = function(){
      return service.sortOptions;
  };

  service.getCustomerPanelStatuses = function(){
      return service.statuses;
  };

  service.getSelectedCustomerPanelOption = function(){
      return service.selectedCustomerPanelOption;
  };

  service.getSelectedCustomerPanelSortOption = function(){
      return service.selectedCustomerPanelSortOption;
  };

  service.setSelectedCustomerPanelOption = function(selectedCustomerPanelOption){
      service.selectedCustomerPanelOption = selectedCustomerPanelOption || service.customerPanelOptions[0];
  };

  service.setSelectedCustomerPanelSortOption = function(selectedCustomerPanelSortOption){
      service.selectedCustomerPanelSortOption = selectedCustomerPanelSortOption || service.sortOptions[0];
  };

  service.setSelectedCustomerPanelOption(service.customerPanelOptions[0]);
  service.setSelectedCustomerPanelSortOption(service.sortOptions[0]);

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