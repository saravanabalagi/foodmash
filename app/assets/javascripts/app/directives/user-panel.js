'use strict';

angular.module('foodmashApp.directives')

.directive('userPanel', ['AuthService', 'UserService','toaster','$location', '$rootScope', function(AuthService, UserService, toaster, $location, $rootScope) {
  return {

    restrict: 'A',

    templateUrl: '/templates/user-panel.html',

    controller: ['$scope', 'AuthService', 'UserService','toaster','$location', '$rootScope', function($scope, AuthService, UserService, toaster, $location, $rootScope) {

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

      $scope.routeToContactUs = function(){
        $location.path("/contact-us");
      };

      $scope.logout = function(){
        $rootScope.disableButton('.logout-button', 'logging out...');
        UserService.logout()
         .then(function(){
         	 $scope.currentUser = null;
           $rootScope.currentUser = null; $rootScope.delivery_addresses = null;
           toaster.pop('error', 'Signed Out!');
           $rootScope.enableButton('.logout-button');
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