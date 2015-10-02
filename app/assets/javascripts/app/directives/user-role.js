'use strict';

angular.module('foodmashApp.directives')

.directive('userRole', ['$q', 'toaster', function($q, toaster){

	return {

		restrict: 'E',

		templateUrl: '/templates/user-role.html',

		controller: ['$scope', '$q', 'toaster','User', function($scope, $q, toaster, User){

			$scope.removeRole = function($chip, user){
				var d = $q.defer();
				User.removeRole(user.id, $chip.name, $chip.resource_id).then(function(user){
					toaster.pop('success', 'Role was successfully removed from the user!');
					$scope.user = user;
					d.resolve(null);
				}, function(err){
					toaster.pop('error', 'Role was not deleted for the user!');
					d.reject(err);
				});
				return d.promise;
			};

		}]

	};

}]);