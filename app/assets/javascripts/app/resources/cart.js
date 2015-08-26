'user strict';

angular.module('foodmashApp.resources')

.factory('Cart', ['railsResourceFactory', '$q', function(railsResourceFactory, $q){
	var resource = railsResourceFactory({
		url: '/web/carts',
		name: 'cart'
	});

	resource.addToCart = function(combo_id, selected_dishes){
		var self = this;
		var d = $q.defer();
		resource.$post(self.$url('addToCart'), {combo_id: combo_id, selected_dishes: selected_dishes}).then(function(response){
			d.resolve(response);
		}, function(err){
			d.reject(err);
		});
		return d.promise;
	};

	return resource;
}]);