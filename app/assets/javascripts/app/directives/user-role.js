'use strict';

angular.module('foodmashApp.directives')

.directive('userRole', ['$q', 'toaster', function($q, toaster){

	return {

		restrict: 'E',

		templateUrl: '/templates/user-role.html',

		controller: ['$scope', '$q', 'toaster', function($scope, $q, toaster){

		}]

	};

}]);