'use strict';

angular.module('foodmashApp.resources')

.factory('Aws', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	
	var resource = railsResourceFactory({
		url: '/web/aws',
		name: 'aws'
	});

	resource.loadAWS = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('/')).then(function(response){
			d.resolve(response);
		}, function(err){ d.reject(err); })
		return d.promise;
	};

	return resource;
}]);