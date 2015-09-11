'use strict';

angular.module('foodmashApp.directives')

.directive('userRole', ['$q', 'toaster', function($q, toaster){

	return {

		restrict: 'E',

		templateUrl: '/templates/user_role.html',

		controller: ['$scope', 'UserRole', '$q', 'toaster', function($scope, UserRole, $q, toaster){
			
		}]

	};

}]);