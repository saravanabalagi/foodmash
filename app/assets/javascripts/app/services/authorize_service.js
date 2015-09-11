'use strict';

angular.module('foodmashApp.services')

.service('AuthorizeService', ['$q', 'toaster', 'User','$rootScope', function($q, toaster, User, $rootScope){

	var service = this;
	this.user = null;
	this.roles = null;

}]);