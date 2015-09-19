'use strict';

angular.module('foodmashApp.resources')

.factory('User', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/users',
		name: 'user'
	});

	resource.addRole = function(user_id, role_name, resource_id){
		var self = this;
		var d = $q.defer();
		resource.$post(self.$url('addRole'), {id: user_id, role_name: role_name, resource_id: resource_id}).then(function(response){
			d.resolve(response);
		}, function(err){
			d.reject(err);
		});
		return d.promise;
	};

	resource.findByEmail = function(email){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('findByEmail'), {email: email}).then(function(response){
			d.resolve(response);
		}, function(err){
			d.reject(err);
		});
		return d.promise;
	};


	return resource;
}]);