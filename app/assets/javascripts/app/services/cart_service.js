'use strict';

angular.module('foodmashApp.services')

.service('CartService', ['$q','AuthService', '$http', function($q, AuthService, $http){

  var service = this;

  this.addToCart = function(combo){
     var d = $q.defer();
     $http({url: '/carts/addToCart', method: 'POST', data: {combo: combo}})
     .then(function(response){
        d.resolve(response);
     }, function(error){
        d.reject(error);
     });
     return d.promise;
  };

}]);