 'use strict';

angular.module('foodmashApp.services')

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
            var auth_token = response.data.auth_token; // talk about this
            console.log(auth_token);
            AuthService.setCurrentUser(user, auth_token);
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
        $http({
          url: '/users/sign_out',
          method: 'DELETE'
        }).success(function(response) { 
          AuthService.removeCurrentUser();
          d.resolve();
        }).error(function(reason) { 
          d.reject(reason);
        });
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
          var auth_token = response.data.auth_token; // talk about this
          console.log(auth_token);
          AuthService.setCurrentUser(user, auth_token);
          d.resolve(user);
        }).error(function(reason) { 
          d.reject(reason);
        });
        return d.promise;
      };  
      
   }]);