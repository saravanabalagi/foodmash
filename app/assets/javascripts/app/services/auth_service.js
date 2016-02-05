'use strict';

angular.module('foodmashApp.services')

.service('AuthService', ['$rootScope', '$q', '$cookieStore', function($rootScope, $q, $cookieStore) {
  
   var service = this;
   this._user = null;
   this.auth_token = null;
   
   this.setCurrentUser = function(u, auth_token) {
     u.auth_token = auth_token;
     service._user = u;
     $cookieStore.put('user', u);
     $cookieStore.put('auth_token', auth_token);
     $rootScope.currentUser = u;
     $rootScope.$broadcast("user:set", u);
     $rootScope.$broadcast("auth_token:set", auth_token);
   };

   this.updateCurrentUser = function(){
      service._user.name = $rootScope.currentUser.name;
      service._user.mobile_no = $rootScope.currentUser.mobile_no;
      $cookieStore.put('user', service._user);
   };

   this.removeCurrentUser = function() {
     service._user = null;
     $cookieStore.remove('user');
     $cookieStore.remove('auth_token');
     $rootScope.currentUser = null;
     $rootScope.$broadcast("user:unset");
     $rootScope.$broadcast("auth_token:unset");
   };
   
   this.currentUser = function() {
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