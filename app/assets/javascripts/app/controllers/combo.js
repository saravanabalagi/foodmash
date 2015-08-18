'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboController', ['$scope', 'Combo', '$location', '$routeParams', 'toaster', '$q', function($scope, Combo, $location, $routeParams, toaster, $q){

	$scope.combo = {};
	$scope.updatedCombo = new Combo;

}])