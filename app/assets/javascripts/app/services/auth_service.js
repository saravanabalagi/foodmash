'use strict';

angular.module('foodmashApp.services')

.service('AuthService', ['$rootScope', '$q', '$cookieStore', function($rootScope, $q, $cookieStore) {
  
   var service = this;
   service._user = null;
   service.auth_token = null;
   
   service.setCurrentUser = function(u, auth_token){
     u.auth_token = auth_token;
     service._user = u;
     $cookieStore.put('user', u);
     $cookieStore.put('auth_token', auth_token);
     $rootScope.currentUser = u;
     $rootScope.$broadcast("user:set", u);
     $rootScope.$broadcast("auth_token:set", auth_token);
   };

   service.updateCurrentUser = function(u){
      var old_user = service._user;
      if(u && old_user && old_user != u){
        service._user = u;
        $cookieStore.put('user', service._user);
        $rootScope.currentUser = u;
        $rootScope.$broadcast("user:set", u);
      }
   };

   service.removeCurrentUser = function(){
     service._user = null;
     $cookieStore.remove('user');
     $cookieStore.remove('auth_token');
     $rootScope.currentUser = null;
     $rootScope.$broadcast("user:unset");
     $rootScope.$broadcast("auth_token:unset");
   };
   
   service.currentUser = function(){
     var d = $q.defer();
     if(service._user) {
       d.resolve(service._user);
     } else if($cookieStore.get('user') && $cookieStore.get('auth_token')) {
       service.setCurrentUser($cookieStore.get('user'), $cookieStore.get('auth_token'));
       d.resolve(service._user);
     } else {
       d.resolve(null);
     }
     return d.promise;
   };

 }]);