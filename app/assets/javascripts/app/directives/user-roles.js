'use strict';

angular.module('foodmashApp.directives')

.directive('userRoles', ['$q', 'toaster', 'User', function($q, toaster, User){

	return {

		restrict: 'E',

		templateUrl: '/templates/user-roles.html',

		controller: ['$scope', '$q', 'toaster','User', function($scope, $q, toaster, User){

			$scope.users = [];

			$scope.searchUsers = function(){
				if($scope.email.length >= 4){
					User.findByEmail($scope.email).then(function(users){
						if(users.length > 0){
							$scope.users = users;
							console.log(users);
						}else{
							$scope.users = null;
						}
					}, function(err){
						$scope.users = null;
					});
				}
			};

		}]

	};

}]);