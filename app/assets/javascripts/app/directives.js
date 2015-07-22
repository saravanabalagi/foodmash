'use strict';

angular.module('foodmashApp.directives', [])

.directive('userPanel', function() {
  return {
    templateUrl: '/templates/user_panel.html',
    controller: function($scope, AuthService, UserService) {

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
        });
      };

    }

  };

});

