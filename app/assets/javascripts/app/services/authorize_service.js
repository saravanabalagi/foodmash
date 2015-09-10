'use strict';

angular.module('foodmashApp.services')

.service('AuthorizeService', ['$q', 'toaster', 'User','$rootScope', function($q, toaster, User, $rootScope){

	var service = this;
	this.user = null;
	this.roles = null;

	this.getCurrentUser = function(){
	 	var d = $q.defer();
	 	var user = $rootScope.currentUser;
	 	if(user){
	  	 User.query({id: user.id}).then(function(users){
	    	 if(user.length > 0){
	      	 service.user = users[0];
	      	 service.roles = service.user.roles;
	     	}else{
	      	 user = null;
	    	 }
	     	d.resolve(service.roles);
	   	}, function(err){
	    	 d.reject(err);
	   	});
	 	}else{
	  	 d.resolve(service.roles);
	 	}
	 	return d.promise;
	};

}]);