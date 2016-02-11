'use strict';

angular.module('foodmashApp.services')

.service('ComboService', ['$rootScope', '$q', function($rootScope, $q) {
  
   var service = this;
   this.combo = {};
   
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