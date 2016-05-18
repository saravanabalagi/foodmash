'use strict';

angular.module('foodmashApp.controllers')

	.controller('LoginController', ['$scope', '$location', 'AuthService', 'UserService','toaster','$rootScope', '$window', function($scope, $location, AuthService, UserService, toaster, $rootScope, $window){
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
				$window.fbq('track', 'CompleteLogin');
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
				$window.fbq('track', 'CompleteRegistration');
			}, function(reason){
				toaster.pop('error', 'Failed to sign in!');
				$scope.login.errors = reason;
				$rootScope.enableButton('.login-button');
			});			
		};

		$scope.checkIfEmailOrMobileNo = function(email_or_mobile_no){
			if(email_or_mobile_no){
				var re_for_mobile_no = /^[0-9]+$/;
				if(!re_for_mobile_no.test(email_or_mobile_no)){
					$scope.login.email = email_or_mobile_no;
					return true;
				}else if(re_for_mobile_no.test(email_or_mobile_no)){
					$scope.login.mobile_no = email_or_mobile_no;
					return false;
				}
			}
			return null;
		};

		function routToCorrectPath(){
			if($rootScope.storeLocation && $rootScope.storeLocation == "/cart"){
				$location.path($rootScope.storeLocation);
			}else{
				$location.path('/');
			}
		};

	}]);