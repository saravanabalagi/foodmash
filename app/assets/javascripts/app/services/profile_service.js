'use strict';

angular.module('foodmashApp.services')

.service('ProfileService', ['$rootScope', '$q', 'User', function($rootScope, $q, User) {
  
   var service = this;
   service.user = {};

   this.getUserForProfile = function(){
      var d = $q.defer();
      if(!service.user.name && $rootScope.currentUser){
        User.query({user_id: $rootScope.currentUser.id}).then(function(users){
          if(users.length > 0){
            service.user = users[0];
            d.resolve(service.user);
          }else{
            service.user = null;
            d.reject(service.user);
          }
          }, function(err){
            service.user = null;
            d.reject(service.user);
        });
      }else{
        d.resolve(service.user);
      }
      return d.promise;
    };
   
   this.setUserForProfile= function(user){
      service.user = user;
      $rootScope.currentUser.name = user.name;
      $rootScope.currentUser.mobile_no = user.mobile_no;
   };

 }]);