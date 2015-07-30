'user strict';

angular.module('foodmashApp.controllers')

.controller('MainController', ['$scope','$mdSidenav', function($scope, $mdSidenav){
	$scope.toggleList = function() {
	    $mdSidenav('left').toggle();
	};
}]);