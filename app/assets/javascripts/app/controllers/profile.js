'use strict';

angular.module('foodmashApp.controllers')

.controller('ProfileController', ['$scope', 'User','$q','toaster', '$rootScope', 'AuthService', function($scope, User, $q, toaster, $rootScope, AuthService){

  $scope.user = {};
  $scope.updatedUser = new User;

  User.query({id: $rootScope.currentUser.id}).then(function(users){
    if(users.length > 0){
      $scope.user = users[0];
    }else{
      $scope.user = null;
    }
  }, function(err){
    $scope.user = null;
  });

  $scope.load = function(){
      angular.element(document).ready(function (){
        new WOW().init();
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
      });
    };

  $scope.setUpdate = function(user){
     $scope.updatedUser = angular.copy(user);
   };

   $scope.updateProfile = function(){
     $scope.user.update().then(function(user){
       toaster.pop('success', 'Profile info updated!');
       $scope.user = user;
       $rootScope.currentUser.name = user.name;
       $rootScope.currentUser.mobile_no = user.mobile_no;
       AuthService.updateCurrentUser();
     }, function(err){
       toaster.pop('error', 'Profile info failed to update!');
     });
   };

}]);