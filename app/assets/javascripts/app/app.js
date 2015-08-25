'use strict';

angular.module('foodmashApp', ['ngRoute', 'foodmashApp.resources', 
	'foodmashApp.services', 'ngCookies', 'foodmashApp.directives', 'foodmashApp.controllers', 
	'foodmashApp.interceptors', 'ngMaterial', 'ngAnimate', 'toaster', 'ngSanitize'])

.config(['$routeProvider', '$locationProvider', '$httpProvider','railsSerializerProvider', function($routeProvider, $locationProvider, $httpProvider, railsSerializerProvider){
	$httpProvider.interceptors.push('UserAuthInterceptor');

	railsSerializerProvider.underscore(angular.identity).camelize(angular.identity);

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
		.when('/cart', {
			controller: 'CartController',
			templateUrl: '/templates/cart.html'
		})
		.when('/combo_options/:id', {
			controller: 'ComboOptionController',
			templateUrl: '/templates/combo_option.html'
		})
		.when('/combos', {
			controller: 'CombosController',
			templateUrl: '/templates/combos.html'
		})
		.when('/combos/:id', {
			controller: 'ComboController',
			templateUrl: '/templates/combo.html'
		})
		.when('/panel', {
			controller: 'PanelController',
			templateUrl: '/templates/panel.html'
		})
		.when('/dish_types', {
			controller: 'DishTypesController',
			templateUrl: '/templates/dish_types.html'
		})
		.when('/restaurants', {
			controller: 'RestaurantsController',
			templateUrl: '/templates/restaurants.html'
		})
		.when('/restaurants/:id', {
			controller: 'RestaurantController', 
			templateUrl: '/templates/restaurant.html'
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
