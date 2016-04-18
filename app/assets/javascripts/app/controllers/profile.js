'use strict';

angular.module('foodmashApp.controllers')

.controller('ProfileController', ['$scope', 'User','$q','toaster', 'AuthService', 'ProfileService', '$rootScope', function($scope, User, $q, toaster, AuthService, ProfileService, $rootScope){

  $scope.user = {};
  $scope.updatedUser = new User;

  ProfileService.getUserForProfile().then(function(user){
    $scope.user = user;
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
    $rootScope.disableButton('.save-button', 'Saving...');
     $scope.user.update().then(function(user){
       toaster.pop('success', 'Profile info updated!');
       $scope.user = user;
       $rootScope.enableButton('.save-button');
       ProfileService.setUserForProfile(user);
       AuthService.updateCurrentUser(user);
     }, function(err){
       toaster.pop('error', 'Profile info failed to update!');
       $rootScope.enableButton('.save-button');
     });
   };

}]);