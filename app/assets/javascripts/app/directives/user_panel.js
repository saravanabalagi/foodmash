'use strict';

angular.module('foodmashApp.directives')

.directive('userPanel', ['AuthService', 'UserService','toaster','$location', function(AuthService, UserService, toaster, $location) {
  return {
    templateUrl: '/templates/user_panel.html',

    controller: ['$scope', 'AuthService', 'UserService','toaster','$location', function($scope, AuthService, UserService, toaster, $location) {

    	$scope.$on('user:set', function(event, currentUser){
    		$scope.currentUser = currentUser;
    	});

      AuthService.currentUser()
     		.then(function(currentUser){
       		 $scope.currentUser = currentUser;
      });


      $scope.routeToPanel = function(){
        if(hasRole("super_admin")){
          $scope.routeToSuperAdminPanel();
        }else if(hasRole("packaging_centre_admin")){
          $scope.routeToPackagingCentrePanel();
        }else if(hasRole("restaurant_admin")){
          $scope.routeToRestaurantAdminPanel();
        }
      };

      $scope.routeToSuperAdminPanel = function(){
        $location.path("/panel");
      };

      $scope.routeToPackagingCentrePanel = function(){
        $location.path("/packagingCentrePanel");
      };

       $scope.routeToRestaurantAdminPanel = function(){
        $location.path("/restaurantPanel");
      };

      $scope.routeToCustomerPanel = function(){
        $location.path("/customerPanel");
      };

      $scope.routToProfile = function(){
        $location.path("/account");
      };

      $scope.logout = function() {
        UserService.logout()
         .then(function(){
         	 $scope.currentUser = null;
           toaster.pop('error', 'Signed Out!');
           $location.path("/");
        });
      };

      $scope.routeToLogin = function(){
        $location.path("/login");
      };

      $scope.hasRolesForPanel = function(){
        if(hasRole('super_admin') || hasRole('packaging_centre_admin') || hasRole('restaurant_admin')){
            return true;
        }else{
          return false;
        }
      };

      function hasRole(name){
        var check = false;
        $scope.currentUser.roles.filter(function(role){
          if(role.name == name){
            check = true;
          }
        });
        return check;
      };

    }]

  };

}]);