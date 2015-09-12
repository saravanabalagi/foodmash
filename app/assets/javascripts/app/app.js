'use strict';

angular.module('foodmashApp', ['ngRoute', 'foodmashApp.resources', 
	'foodmashApp.services', 'ngCookies', 'foodmashApp.directives', 'foodmashApp.controllers', 
	'foodmashApp.interceptors', 'ngMaterial', 'ngAnimate', 'toaster', 'ngSanitize'])

.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
	
	$httpProvider.interceptors.push('UserAuthInterceptor');

	$routeProvider
	
	.when('/users/:user_id', {
	    controller: 'ProfileController',
	    templateUrl: '/templates/profile.html', 
	    resolve: {
	      user:
	      function($q, $route, $location, AuthService, toaster, User, $routeParams) {
	        var d = $q.defer(); 

	        AuthService.currentUser().then(function(user) { 
	          if(user && user.id == $route.current.params.user_id) {
	            d.resolve();
	          } else {
	            $location.path('/');
	          }
	        });
	        
	        return d.promise;
	      }
	    }
	  })
		.when('/checkout', {
			controller: 'CheckoutController', 
			templateUrl: '/templates/checkout.html'
		})
		.when('/user_roles', {
			controller: 'UserRolesController',
			templateUrl: '/templates/user_roles.html',
			resolve: {
				user_roles: 
				function(AuthorizeService){
					AuthorizeService.authorizeRoute();
				}
				}
		})
		.when('/cart', {
			controller: 'CartController',
			templateUrl: '/templates/cart.html'
		})
		.when('/combo_options/:id', {
			controller: 'ComboOptionController',
			templateUrl: '/templates/combo_option.html',
			resolve: {
				combo_option: 
				function(AuthorizeService){
					AuthorizeService.authorizeRoute();
				}
			}
		})
		.when('/combos', {
			controller: 'CombosController',
			templateUrl: '/templates/combos.html',
			resolve: {
				combos: 
				function(AuthorizeService){
					AuthorizeService.authorizeRoute();
				}
			}
		})
		.when('/combos/:id', {
			controller: 'ComboController',
			templateUrl: '/templates/combo.html',
			resolve: {
				combo: 
				function(AuthorizeService){
					AuthorizeService.authorizeRoute();
				}
			}
		})
		.when('/panel', {
			controller: 'PanelController',
			templateUrl: '/templates/panel.html',
			resolve: {
				panel: 
				function(AuthorizeService){
					AuthorizeService.authorizeRoute();
				}
			}
		})
		.when('/dish_types', {
			controller: 'DishTypesController',
			templateUrl: '/templates/dish_types.html',
			resolve: {
				dish_types: 
				function(AuthorizeService){
					AuthorizeService.authorizeRoute();
				}
			}
		})
		.when('/cuisines', {
			controller: 'CuisinesController',
			templateUrl: '/templates/cuisines.html',
			resolve: {
				cuisines: 
				function(AuthorizeService){
					AuthorizeService.authorizeRoute();
				}
			}
		})
		.when('/restaurants', {
			controller: 'RestaurantsController',
			templateUrl: '/templates/restaurants.html',
			resolve: {
				restaurants: 
				function(AuthorizeService){
					AuthorizeService.authorizeRoute();
				}
			}
		})
		.when('/restaurants/:id', {
			controller: 'RestaurantController', 
			templateUrl: '/templates/restaurant.html',
			resolve: {
				restaurant: 
				function(AuthorizeService){
					AuthorizeService.authorizeRoute();
				}
			}
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
