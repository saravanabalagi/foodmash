'use strict';

angular.module('foodmashApp.controllers')

	.controller('LoginController', ['$scope', '$location', 'AuthService', 'UserService','toaster', function($scope, $location, AuthService, UserService, toaster){
		$scope.signup = {};
		$scope.login = {};

		AuthService.currentUser().then(function(user){
			$scope.user = user;
		});

		$scope.submitSignup = function(){

			UserService.signup($scope.signup)
			.then(function(user){
				$location.path('/');
				toaster.pop('success', 'Registered successfully!');
			}, function(reason){
				$scope.signup.errors = reason;
			});

		};

		$scope.submitLogin = function(){
			UserService.login($scope.login)
			.then(function(user){
				$location.path('/');
				toaster.pop('success', 'Signed In!');
			}, function(reason){
				$scope.login.errors = reason;
			});			
		};

	}]);