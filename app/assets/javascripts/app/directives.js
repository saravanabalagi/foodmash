'use strict';

angular.module('foodmashApp.directives', [])

.directive('userPanel', ['AuthService', 'UserService','toaster', function(AuthService, UserService, toaster) {
  return {
    templateUrl: '/templates/user_panel.html',
    controller: ['$scope', 'AuthService', 'UserService','toaster', function($scope, AuthService, UserService, toaster) {

    	$scope.$on('user:set', function(event, currentUser){
    		$scope.currentUser = currentUser;
    	});

      AuthService.currentUser()
     		.then(function(currentUser){
       		 $scope.currentUser = currentUser;
      });

      $scope.logout = function() {
        UserService.logout()
         .then(function(){
         	 $scope.currentUser = null;
           toaster.pop('error', 'Signed Out!');
        });
      };

    }]

  };

}])

.directive('confirm', [function(){
  return {
    
  };
}]); 

