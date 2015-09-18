'use strict';

angular.module('foodmashApp.services')

.service('AuthorizeService', ['$q', 'toaster','$rootScope','$location', function($q, toaster, $rootScope, $location){

	var service = this;

	this.authorizeRouteForSuperAdmin = function(){
		var d = $q.defer();
		var check = false;
		if($rootScope.currentUser && $rootScope.currentUser.roles){
			$rootScope.currentUser.roles.filter(function(role){
				if(role.name == "super_admin"){
					check = true;
					d.resolve();
				}
			});
			if(!check){
				toaster.pop('error', "Unauthorized!");
				$location.path("/");
				d.reject(null);
			}
		}else{
			toaster.pop('error', "Not logged in!");
			$location.path("/login");
			d.reject(null);
		}
		return d.promise;
	};

	this.checkForLogin = function(){
		var d = $q.defer();
		if($rootScope.currentUser){
			d.resolve(null);
		}else{
			d.reject(null);
		}
		return d.promise;
	};

}]);