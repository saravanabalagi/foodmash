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
				toaster.pop('error', 'Failed to Register!');
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

		$scope.$watch('signup.email', function(n, o){
			if(n){
				$scope.checkPresenceOfEmail(n);
			}
		});

		$scope.$watch('signup.mobile_no', function(n, o){
			if(n){
				$scope.checkPresenceOfMobileNo(n);
			}
		});

		$scope.checkPresenceOfEmail = function(email){
			angular.element(document).ready(function (){
				if(email){
					var re_for_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					if(re_for_email.test(email)){
						UserService.checkEmail({email: email}).then(function(response){
							$scope.emailCheckMessage = 'Email is available!';
							$(".signup-email").removeClass("has-error");
						}, function(err){
							$scope.emailCheckMessage = 'Email is not available!';
							$(".signup-email").addClass("has-error");
						});
					}else{
						$scope.emailCheckMessage = '';
					}
				}
			});
		};

		$scope.checkPresenceOfMobileNo = function(mobile_no){
			angular.element(document).ready(function (){
				if(mobile_no){
					var re_for_mobile_no = /^[789]\d{9}$/;
					if(re_for_mobile_no.test(mobile_no)){
						UserService.checkMobileNo({mobile_no: mobile_no}).then(function(response){
							$scope.mobileNoCheckMessage = 'Mobile No is available!';
							$(".signup-mobile-no").removeClass("has-error");
						}, function(err){
							$scope.mobileNoCheckMessage = 'Mobile No is not available!';
							$(".signup-mobile-no").addClass("has-error");
						});
					}else{
						$scope.mobileNoCheckMessage = '';
					}
				}
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