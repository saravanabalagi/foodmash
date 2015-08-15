'use strict';

angular.module('foodmashApp.directives', [])

.directive('userPanel', ['AuthService', 'UserService','toaster', function(AuthService, UserService, toaster) {
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

      $scope.openMenu = function($mdOpenMenu, ev){
        $mdOpenMenu(ev);
      };

      $scope.routeToPanel = function(){
        $location.path("/panel");
      };

      $scope.routToProfile = function(){
        $location.path("/user/" + $scope.currentUser.id);
      };

      $scope.logout = function() {
        UserService.logout()
         .then(function(){
         	 $scope.currentUser = null;
           toaster.pop('error', 'Signed Out!');
        });
      };

      $scope.routeToLogin = function(){
        $location.path("/login");
      };

    }]

  };

}]);

