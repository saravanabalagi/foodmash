'use strict';

angular.module('foodmashApp.controllers')

.controller('ProfileController', ['$scope', '$routeParams', 'User','$q','toaster', function($scope, $routeParams, User, $q, toaster){

  $scope.user = {};
  $scope.updatedUser = new User;

  User.query({id: $routeParams.user_id})
  .then(function(users) {
    if(users.length > 0){
      $scope.user = users[0];
      console.log($scope.user);
    }
  });

  $scope.setUpdate = function(user){
     $scope.updatedUser = angular.copy(user);
   };

   $scope.updateProfile = function(updateCross){
     var d = $q.defer()
     if(!updateCross){
       if(!$scope.profileUpdateForm.$pristine){
         $scope.updatedUser.update().then(function(result){
           toaster.pop('success', 'Profile info updated!');
           $scope.user = $scope.updatedUser;
           d.resolve(result);
         }, function(err){
           toaster.pop('error', 'Profile info failed to update!');
           d.reject(err);
         });
       }else{
         d.resolve(null);
       }
     }
    return d.promise;
   };

}]);