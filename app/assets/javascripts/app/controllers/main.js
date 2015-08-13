'user strict';

angular.module('foodmashApp.controllers')

.controller('MainController', ['$scope','$mdSidenav','$location', function($scope, $mdSidenav, $location){
	$scope.loading = true;

	$scope.toggleList = function() {
	    $mdSidenav('left').toggle();
	};

	$scope.$on('$viewContentLoaded', function(){
		$scope.loading = false;
	});

	$scope.routeToRoot = function(){
		$location.path('/');
	};
}]);