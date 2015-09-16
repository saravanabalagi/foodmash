'use strict';

angular.module('foodmashApp.controllers')

	.controller('LoginController', ['$scope', '$location', 'AuthService', 'UserService','toaster','$rootScope', function($scope, $location, AuthService, UserService, toaster, $rootScope){
		$scope.signup = {};
		$scope.login = {};

		AuthService.currentUser().then(function(user){
			$scope.user = user;
		});

		$scope.submitSignup = function(){

			UserService.signup($scope.signup)
			.then(function(user){
				toaster.pop('success', 'Registered successfully!');
				routToCorrectPath();
			}, function(reason){
				$scope.signup.errors = reason;
			});

		};

		$scope.submitLogin = function(){
			UserService.login($scope.login)
			.then(function(user){
				toaster.pop('success', 'Signed In!');
				routToCorrectPath();
			}, function(reason){
				$scope.login.errors = reason;
			});			
		};

		function routToCorrectPath(){
			if($rootScope.storeLocation && $rootScope.storeLocation == "/checkout"){
				$location.path($rootScope.storeLocation);
			}else{
				$location.path('/');
			}
		};

	}]);