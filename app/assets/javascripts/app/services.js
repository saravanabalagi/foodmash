'use strict';

angular.module('foodmashApp.services', [])

.service('AuthService', ['$rootScope', '$q', '$cookieStore', function($rootScope, $q, $cookieStore) {
  
   var service = this;
   this._user = null;
   
   this.setCurrentUser = function(u) {
     service._user = u;
     $cookieStore.put('user', u);
     $rootScope.$broadcast("user:set", u);
   };
   
   this.removeCurrentUser = function() {
     service._user = null;
     $cookieStore.remove('user');
     $rootScope.$broadcast("user:unset");
   };
   
   this.currentUser = function() {
     var d = $q.defer();
     if(service._user) {
       d.resolve(service._user);
     } else if($cookieStore.get('user')) {
       service.setCurrentUser($cookieStore.get('user'));
       d.resolve(service._user);
     } else {
       d.resolve(null);
     }
     return d.promise;
   };

 }])



 .service('UserService', ['$rootScope', '$q', '$cookieStore', '$http', 'AuthService', function($rootScope, $q, $cookieStore, $http, AuthService) {
      this.currentUser = AuthService.currentUser;

      this.login = function(params) {
        var d = $q.defer();
        $http({
          url: '/users/sign_in',
          method: 'POST',
          data: {
            user: params
          }
        }).success(function(response) { 
          if(response.success) {
            var user = response.data.user;
            user.auth_token = response.data.auth_token; // talk about this
            AuthService.setCurrentUser(user);
            d.resolve(user);
          } else {
            d.reject(response)
          }
        }).error(function(reason) { 
          d.reject(reason);
        });
        return d.promise;
      };

      this.logout = function() {
        var d = $q.defer();
        AuthService.removeCurrentUser();
        d.resolve();
        return d.promise;
      };

      this.signup = function(params) {
        var d = $q.defer();
        $http({
          url: '/users',
          method: 'POST',
          data: {
            user: params
          }
        }).success(function(response) { 
          var user = response.data.user;
          user.auth_token = response.data.auth_token; // talk about this
          AuthService.setCurrentUser(user);
          d.resolve(user);
        }).error(function(reason) { 
          d.reject(reason);
        });
        return d.promise;
      };  
      
   }]);

