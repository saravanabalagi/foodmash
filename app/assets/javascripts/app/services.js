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

}])

.service('CombosService', ['$q','$http', function($q, $http){
  var service = this;
  var sideNavOptions = [
     {pic_url: "https://s3-ap-southeast-1.amazonaws.com/cshare1/images/offers.svg", name: "Offers", icon_class: "nav-icon offers"},
     {pic_url: "https://s3-ap-southeast-1.amazonaws.com/cshare1/images/for_1.svg", name: "Micro", icon_class: "nav-icon micro"},
     {pic_url: "https://s3-ap-southeast-1.amazonaws.com/cshare1/images/for_2.svg", name: "Medium", icon_class: "nav-icon medium"},
     {pic_url: "https://s3-ap-southeast-1.amazonaws.com/cshare1/images/for_3.svg", name: "Mega", icon_class: "nav-icon mega"}
  ];

  this.loadSideNavOptions = function(){
    var d = $q.defer();
    if(sideNavOptions){
      d.resolve(sideNavOptions);
    }else{
      d.reject(null);
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
          user.auth_token = response.data.auth_token; // talk about this
          AuthService.setCurrentUser(user);
          d.resolve(user);
        }).error(function(reason) { 
          d.reject(reason);
        });
        return d.promise;
      };  
      
   }]);

