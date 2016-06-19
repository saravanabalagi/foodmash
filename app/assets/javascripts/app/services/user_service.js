 'use strict';

angular.module('foodmashApp.services')

 .service('UserService', ['$rootScope', '$q', '$http', 'AuthService', function($rootScope, $q, $http, AuthService) {
      
      var service = this;     
      service.currentUser = AuthService.currentUser;

       service.checkEmail = function(params){
        var d = $q.defer();
        $http({
          url: '/web/users/checkEmail',
          method: 'POST',
          data: {
            user: params
          }
        }).success(function(response){ 
          if(response.success){
            d.resolve(response);
          }else{
            d.reject(response)
          }
        }).error(function(err){ 
          d.reject(err);
        });
        return d.promise;
      };

       service.checkMobileNo = function(params){
        var d = $q.defer();
        $http({
          url: '/web/users/checkMobileNo',
          method: 'POST',
          data: {
            user: params
          }
        }).success(function(response) { 
          if(response.success){
            d.resolve(response);
          }else{
            d.reject(response)
          }
        }).error(function(err){ 
          d.reject(err);
        });
        return d.promise;
      };

      service.login = function(params) {
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
            var auth_token = response.data.auth_token; 
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

      service.logout = function() {
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

      service.signup = function(params) {
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
          AuthService.setCurrentUser(user, auth_token);
          d.resolve(user);
        }).error(function(reason) { 
          d.reject(reason);
        });
        return d.promise;
      };  
      
   }]);