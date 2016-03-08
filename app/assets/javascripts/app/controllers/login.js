'use strict';

angular.module('foodmashApp.controllers')

	.controller('LoginController', ['$scope', '$location', 'AuthService', 'UserService','toaster','$rootScope', function($scope, $location, AuthService, UserService, toaster, $rootScope){
		$scope.signup = {};
		$scope.login = {};

		AuthService.currentUser().then(function(user){
			$scope.user = user;
		});

		$scope.submitSignup = function(){
			$rootScope.addLoader('.register-button', 'transparent', 'red');
			UserService.signup($scope.signup)
			.then(function(user){
				toaster.pop('success', 'Registered successfully!');
				routToCorrectPath();
				$rootScope.removeLoader('.register-button');
			}, function(reason){
				toaster.pop('error', 'Was not able to Register!');
				$scope.signup.errors = reason;
				$rootScope.removeLoader('.register-button');
			});
		};

		$scope.submitLogin = function(){
			$rootScope.addLoader('.login-button', 'transparent', 'red');
			UserService.login($scope.login)
			.then(function(user){
				toaster.pop('success', 'Signed In!');
				routToCorrectPath();
				$rootScope.removeLoader('.login-button');
			}, function(reason){
				toaster.pop('error', 'Failed to sign in!');
				$scope.login.errors = reason;
				$rootScope.removeLoader('.login-button');
			});			
		};

		function routToCorrectPath(){
			if($rootScope.storeLocation && $rootScope.storeLocation == "/cart"){
				$location.path($rootScope.storeLocation);
			}else{
				$location.path('/');
			}
		};

	}]);