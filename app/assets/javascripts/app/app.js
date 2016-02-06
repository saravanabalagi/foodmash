'use strict';

angular.module('foodmashApp', ['ngRoute', 'foodmashApp.resources', 
	'foodmashApp.services', 'ngCookies', 'foodmashApp.directives', 'foodmashApp.controllers', 
	'foodmashApp.interceptors', 'toaster', 'ngFileUpload', 'ngSanitize'])

.config(['$routeProvider', '$locationProvider', '$httpProvider','railsSerializerProvider', function($routeProvider, $locationProvider, $httpProvider, railsSerializerProvider){
	
	$httpProvider.interceptors.push('UserAuthInterceptor');

	railsSerializerProvider.underscore(angular.identity).camelize(angular.identity);

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
			templateUrl: '/templates/packaging_centre_panel.html',
			resolve: {
				panel: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForPackagingCentreAdmin();
				}
			}
		})
		.when('/restaurantPanel', {
			controller: 'RestaurantPanelController',
			templateUrl: '/templates/restaurant_panel.html',
			resolve: {
				panel: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForRestaurantAdmin();
				}
			}
		})
		.when('/customerPanel', {
			controller: 'CustomerPanelController',
			templateUrl: '/templates/customer_panel.html',
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
		.when('/', 
		{
			controller: 'MainController',
			templateUrl: '/templates/main.html'
		}
		).otherwise({redirectTo: '/'});

		$locationProvider.html5Mode(true);
}]);
