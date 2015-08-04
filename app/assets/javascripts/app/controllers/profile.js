'use strict';

angular.module('foodmashApp.controllers')
.controller('ProfileController', ['$scope', '$routeParams', 'User','$q','toaster', function($scope, $routeParams, User, $q, toaster){

  $scope.user = {};

  User.query({id: $routeParams.user_id})
  .then(function(users) {
    if(users.length > 0){
      $scope.user = users[0];
    }
  });

  $scope.updateProfile = function(){
    var d = $q.defer()
    if(!$scope.profileUpdateForm.$pristine){
      $scope.user.update().then(function(result){
        toaster.pop('success', 'Profile info updated!');
        d.resolve();
      }, function(err){
        toaster.pop('error', 'Profile info failed to update!');
        d.reject();
      });
    }else{
      d.reject(null);
    }
    return d.promise;
   };

}]);