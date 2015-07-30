'user strict';

angular.module('foodmashApp.controllers')

.controller('MainController', ['$scope','$mdSidenav','$location', function($scope, $mdSidenav, $location){
	$scope.toggleList = function() {
	    $mdSidenav('left').toggle();
	};

	$scope.routeToRoot = function(){
		$location.path('/');
	};
}]);