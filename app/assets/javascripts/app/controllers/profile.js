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
      ProfileService.loadUserForProfile().then(function(user){
        $scope.user = user;
      }, function(err){
        $scope.user = null;
      });
    };

  $scope.setUpdate = function(user){
     $scope.updatedUser = angular.copy(user);
   };

   $scope.sendOtp = function(){
    $rootScope.disableButton('.send-otp-button', 'Sendint Otp...');
     User.sendOtp().then(function(user){
       toaster.pop('success', 'Otp was sent to your mobile no!');
       $scope.user = user;
       AuthService.updateCurrentUser(user);
       ProfileService.user = user;
       $rootScope.enableButton('.send-otp-button');
     }, function(err){
       toaster.pop('error', 'Failed to send Otp!');
       $rootScope.enableButton('.send-otp-button');
     });
   };

   $scope.resendOtp = function(){
    $rootScope.disableButton('.resend-otp-button', 'Sendint Otp...');
     User.sendOtp().then(function(user){
       toaster.pop('success', 'Otp was sent to your mobile no!');
       $scope.user = user;
       AuthService.updateCurrentUser(user);
       ProfileService.user = user;
       $rootScope.enableButton('.resend-otp-button');
     }, function(err){
       toaster.pop('error', 'Failed to send Otp!');
       $rootScope.enableButton('.resend-otp-button');
     });
   };

   $scope.verifyOtp = function(otp){
    $rootScope.disableButton('.verify-otp-button', 'Verifying Otp...');
     User.verifyOtp(otp).then(function(user){
       toaster.pop('success', 'Your account was verified!');
       $scope.user = user;
       AuthService.updateCurrentUser(user);
       ProfileService.user = user;
       $rootScope.enableButton('.verify-otp-button');
     }, function(err){
       toaster.pop('error', 'Failed to verify your account!');
       $rootScope.enableButton('.verify-otp-button');
     });
   };

   $scope.updateProfile = function(){
    $rootScope.disableButton('.save-button', 'Saving...');
     $scope.user.update().then(function(user){
       toaster.pop('success', 'Profile info updated!');
       $scope.user = user;
       $rootScope.enableButton('.save-button');
       ProfileService.setUserForProfile(user);
       AuthService.updateCurrentUser(user);
       ProfileService.user = user;
     }, function(err){
       toaster.pop('error', 'Profile info failed to update!');
       $rootScope.enableButton('.save-button');
     });
   };

}]);