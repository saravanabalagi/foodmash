'use strict';

angular.module('foodmashApp.resources')

.factory('PackagingCentre', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/packaging_centres', 
		name: 'packaging_centre'
	});

	resource.prototype.getCartsForCentre = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('getCartsForCentre')).then(function(response){
			d.resolve(response);
		}, function(err){
			d.reject(err);
		})
		return d.promise;
	};

	return resource;
}]);