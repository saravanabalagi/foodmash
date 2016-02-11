'use strict';

angular.module('foodmashApp.resources')

.factory('Combo', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	
	var resource = railsResourceFactory({
		url: '/web/combos',
		name: 'combo'
	});

	resource.loadComboAvailability = function(combo_id){
		var self = this;
		var d = $q.defer();
		resource.$post(self.$url('getComboAvailability'), {id: combo_id}).then(function(combo){
			d.resolve(combo);
		}, function(err){ d.reject(err); })
		return d.promise;
	};

	resource.loadFromPackagingCentre = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('loadFromPackagingCentre')).then(function(loadedFromPackagingCentre){
			d.resolve(loadedFromPackagingCentre);
		}, 
		function(err){ d.reject(err); });
		return d.promise;
	};

	resource.loadAWS = function(){
		var self = this;
		var d = $q.defer();
		resource.$get(self.$url('loadAWS')).then(function(response){
			d.resolve(response);
		}, function(err){ d.reject(err); })
		return d.promise;
	};

	return resource;
}]);