'use strict';

angular.module('foodmashApp.services')

.service('ComboDescriptionService', ['$rootScope', '$q', function($rootScope, $q) {
  
   var service = this;
   service.combo = {};
   
   this.setComboForDescription= function(combo) {
      service.combo = combo;
   };

   this.getComboForDescription = function(){
      var d = $q.defer();
      if(service.combo){
        d.resolve(service.combo);
      }else{
        d.reject(service.combo);      
      }
      return d.promise;
   };
   
 }]);