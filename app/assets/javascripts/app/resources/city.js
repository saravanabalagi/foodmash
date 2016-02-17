'use strict';

angular.module('foodmashApp.resources')

.factory('City', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/cities', 
		name: 'city'
	});

	resource.setCity = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('setCity')).then(function(response){
			d.resolve(response);
		}, function(err){
			d.reject(err);
		});
		return d.promise;
	};

	return resource;
}]);