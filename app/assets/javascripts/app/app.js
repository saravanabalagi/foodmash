'use strict';

angular.module('foodmashApp', ['ngRoute', 'foodmashApp.resources', 
	'foodmashApp.services', 'ngCookies', 'foodmashApp.directives', 'foodmashApp.controllers', 
	'foodmashApp.interceptors', 'toaster', 'ngFileUpload', 'ngSanitize', 'LocalStorageModule', 'angular.filter'])

.config(['$routeProvider', '$locationProvider', '$httpProvider','railsSerializerProvider', 'localStorageServiceProvider', function($routeProvider, $locationProvider, $httpProvider, railsSerializerProvider, localStorageServiceProvider){
	
	$httpProvider.interceptors.push('UserAuthInterceptor');

	railsSerializerProvider.underscore(angular.identity).camelize(angular.identity);

	localStorageServiceProvider
	.setPrefix('foodmashApp')
	.setStorageType('localStorage')
	.setStorageCookie(30, '/')
	.setStorageCookieDomain('www.foodmash.in')
	.setNotify(true, true);

	$routeProvider
	
	.when('/account', {
	    controller: 'ProfileController',
	    templateUrl: '/templates/profile.html', 
	    resolve: {
	      user:
	      function($q, $rootScope, $location, AuthService, toaster, User) {
	        var d = $q.defer(); 

	        AuthService.currentUser().then(function(user) { 
	          if(user && user.id == $rootScope.currentUser.id) {
	            d.resolve();
	          } else {
	          	toaster.pop('error', 'Unauthorized!');
	            $location.path('/');
	          }
	        });
	        
	        return d.promise;
	      }
	    }
	  })
		.when('/cart', {
			controller: 'CartController',
			templateUrl: '/templates/cart.html'
		})
		.when('/panel', {
			controller: 'PanelController',
			templateUrl: '/templates/panel.html',
			resolve: {
				panel: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
		})
		.when('/packagingCentrePanel', {
			controller: 'PackagingCentrePanelController',
			templateUrl: '/templates/packaging-centre-panel.html',
			resolve: {
				panel: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForPackagingCentreAdmin();
				}
			}
		})
		.when('/packagingCentrePanel/Order', {
			controller: 'PackagingCentreOrderController',
			templateUrl: '/templates/packaging-centre-order.html',
			resolve: {
				panel: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForPackagingCentreAdmin();
				}
			}
		})
		.when('/restaurantPanel', {
			controller: 'RestaurantPanelController',
			templateUrl: '/templates/restaurant-panel.html',
			resolve: {
				panel: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForRestaurantAdmin();
				}
			}
		})
		.when('/customerPanel', {
			controller: 'CustomerPanelController',
			templateUrl: '/templates/customer-panel.html',
			resolve: {
				panel: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForCustomer();
				}
			}
		})
		.when('/combo-description', {
			controller: 'ComboDescriptionController',
			templateUrl: '/templates/combo-description.html'
		})
		.when('/login', 
		{
			controller: 'LoginController',
			templateUrl: '/templates/login.html'
		})
		.when('/terms-and-conditions', {
			templateUrl: '/templates/terms-and-conditions.html'
		})
		.when('/privacy-policy', {
			templateUrl: '/templates/privacy-policy.html'
		})
		.when('/refund-policy', {
			templateUrl: '/templates/refund-policy.html'
		})
		.when('/about-us', {
			templateUrl: '/templates/about-us.html'
		})
		.when('/contact-us', {
			templateUrl: '/templates/contact-us.html'
		})
		.when('/web/payments/success', {
			controller: 'CustomerPanelController',
			templateUrl: '/templates/customer-panel.html',
			resolve: {
				panel: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForCustomer();
				}
			}
		})
		.when('/web/payments/failure', {
			controller: 'CustomerPanelController',
			templateUrl: '/templates/customer-panel.html',
			resolve: {
				panel: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForCustomer();
				}
			}
		})
		.when('/', 
		{
			controller: 'MainController',
			templateUrl: '/templates/main.html'
		}
		).otherwise({redirectTo: '/'});

		$locationProvider.html5Mode(true);
}]);
