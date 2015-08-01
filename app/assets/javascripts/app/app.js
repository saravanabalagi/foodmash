'use strict';

angular.module('foodmashApp', ['ngRoute', 'foodmashApp.controllers', 
	'foodmashApp.services', 'ngCookies', 'foodmashApp.directives', 'foodmashApp.resources', 
	'foodmashApp.interceptors', 'ngMaterial', 'ngAnimate', 'toaster', 'ngSanitize'])

.config(['$routeProvider', '$locationProvider', '$httpProvider','railsSerializerProvider' ,function($routeProvider, $locationProvider, $httpProvider, railsSerializerProvider){
	$httpProvider.interceptors.push('UserAuthInterceptor');

	railsSerializerProvider.underscore(angular.identity).camelize(angular.identity);

	$routeProvider
	.when('/user/:user_id', 
	  {
	    templateUrl: '/templates/profile.html', 
	    controller: 'ProfileController',
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
		.when('/restaurant', {
			controller: 'RestaurantsController',
			templateUrl: '/templates/restaurants.html'
		})
		.when('/restaurant/:id', {
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
			controller: 'CombosController',
			templateUrl: '/templates/combos.html.erb'
		}
		).otherwise({redirectTo: '/'});
		$locationProvider.html5Mode(true);
}]);
