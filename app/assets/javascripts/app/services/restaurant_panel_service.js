'use strict';

angular.module('foodmashApp.services')

.service('RestaurantPanelService', ['$rootScope', '$q', 'Restaurant', function($rootScope, $q, Restaurant) {
  
   var service = this;
   service.restaurant = {};
   service.cart = {};
   service.restaurantPanelOptions = [
      {name: 'Current', icon_class: 'fa fa-inbox pull-right', checkout: 'Delivered'},
      {name: 'Delivered', icon_class: 'fa fa-archive pull-right', checkout: 'Current'}
    ];
    service.selectedRestaurantPanelOption = null;

    service.statuses = [
      {name: "purchased", alias: "Placed Order", icon_class: "fa fa-clock-o", percent: 'width:0%'},
      {name: "ordered", alias: "Acknowledged", icon_class: "fa fa-check-circle", percent: 'width:35%'},
      {name: "cooked", alias: "Cooked", icon_class: "fa fa-cutlery", percent: 'width:65%'},
      {name: "collected", alias: "Collected", icon_class: "fa fa-truck", percent: 'width:100%'}
    ];

    service.sortOptions = [
      {name: 'Newest First', icon_class: 'fa fa-sort-amount-asc pull-right', reverse: true},
      {name: 'Oldest First', icon_class: 'fa fa-sort-amount-desc pull-right', reverse: false}
    ];
    service.selectedSortOption = null;

  service.getRestaurantPanelSortOptions = function(){
    return service.sortOptions;
  };

  service.getRestaurantPanelStatuses = function(){
    return service.statuses;
  };

  service.getRestaurantPanelOptions = function(){
    return service.restaurantPanelOptions;
  };

  service.setSelectedRestaurantPanelOption = function(selectedRestaurantPanelOption){
    service.selectedRestaurantPanelOption = selectedRestaurantPanelOption || service.restaurantPanelOptions[0];
  };

  service.getSelectedRestaurantPanelOption = function(selectedRestaurantPanelOption){
      return service.selectedRestaurantPanelOption;
  };

  service.setSelectedSortOption = function(selectedSortOption){
    service.selectedSortOption = selectedSortOption || service.sortOptions[0];
  };

  service.getSelectedSortOption = function(selectedSortOption){
      return service.selectedSortOption;
  };

  service.setSelectedRestaurantPanelCart = function(cart){
    service.cart = cart;
  };

  service.getSelectedRestaurantPanelCart = function(){
    return service.cart;
  };

  service.setSelectedRestaurantPanelOption(service.restaurantPanelOptions[0]);
  service.setSelectedSortOption(service.sortOptions[0]);

   service.getCartsForPanel = function(role){
      var d = $q.defer();
      if(service.restaurant && !service.restaurant.name){
         Restaurant.query({id: role.resource.id}).then(function(restaurants){
          if(restaurants.length > 0){
            service.restaurant = restaurants[0];

            service.restaurant.getCartsForRestaurant().then(function(carts){
              if(carts && carts.length > 0){
                service.restaurant.carts = carts;
              }else{
                service.restaurant.carts = null;
              }
            }, function(err){
              service.restaurant.carts = null;
              d.resolve(service.restaurant);
            });

          }else{
            service.restaurant.carts = null;
            service.restaurant = null;
            d.reject(service.restaurant);
          }
        });
      }else{
        d.resolve(service.restaurant);
      }
      return d.promise;
   };

   service.loadCartsForPanel = function(role){
      var d = $q.defer();
       Restaurant.query({id: role.resource.id}).then(function(restaurants){
        if(restaurants.length > 0){
          service.restaurant = restaurants[0];

          service.restaurant.getCartsForRestaurant().then(function(carts){
            if(carts && carts.length > 0){
              service.restaurant.carts = carts;
            }else{
              service.restaurant.carts = null;
            }
          }, function(err){
            service.restaurant.carts = null;
            d.resolve(service.restaurant);
          });

        }else{
          service.restaurant.carts = null;
          service.restaurant = null;
          d.reject(service.restaurant);
        }
      });
      return d.promise;
   };
   
   service.setUpdatedCart = function(cart){
      if(service.restaurant && service.restaurant.carts && service.restaurant.carts.length > 0){
        service.restaurant.carts.filter(function(c){
          if(c.id == cart.id){
            var index = service.restaurant.carts.indexOf(c);
            service.restaurant.carts[index] = cart;
          }
        });
      }
   };

 }]);