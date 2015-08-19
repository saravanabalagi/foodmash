'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboOptionController', ['$scope', 'ComboOptionDish', '$location', '$routeParams', 'toaster', '$q', function($scope, ComboOptionDish, $location, $routeParams, toaster, $q, Dish){

	$scope.combo_option_dishes = {};

	ComboOptionDish.query({combo_option_id: $routeParams.id}).then(function(combo_option_dishes){
		if(combo_option_dishes.length > 0){
			$scope.combo_option_dishes = combo_option_dishes;
		}else{
			$scope.combo_option_dishes = new Array;
		}
	}, function(err){
		$scope.combo_option_dishes = null;
	});

}]);