'use strict';

angular.module('foodmashApp.controllers')

	.controller('LoginController', ['$scope', '$location', 'AuthService', 'UserService','toaster','$rootScope', function($scope, $location, AuthService, UserService, toaster, $rootScope){
		$scope.signup = {};
		$scope.login = {};

		AuthService.currentUser().then(function(user){
			$scope.user = user;
		});

		$scope.submitSignup = function(){
			$rootScope.disableButton('.register-button', 'Registering...');
			UserService.signup($scope.signup)
			.then(function(user){
				toaster.pop('success', 'Registered successfully!');
				routToCorrectPath();
				$rootScope.enableButton('.register-button');
			}, function(reason){
				toaster.pop('error', 'Email or Mobile no was already taken!');
				$scope.signup.errors = reason;
				$rootScope.enableButton('.register-button');
			});
		};

		$scope.submitLogin = function(){
			$rootScope.disableButton('.login-button', 'Logging in...');
			UserService.login($scope.login)
			.then(function(user){
				toaster.pop('success', 'Signed In!');
				routToCorrectPath();
				$rootScope.enableButton('.login-button');
			}, function(reason){
				toaster.pop('error', 'Failed to sign in!');
				$scope.login.errors = reason;
				$rootScope.enableButton('.login-button');
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