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

	resource.loadFromPackagingCentre = function(val){
		var self = this;
		var d = $q.defer();
		resource.$post(self.$url('loadFromPackagingCentre'), {packaging_centre_id: val.packaging_centre_id}).then(function(loadedFromPackagingCentre){
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