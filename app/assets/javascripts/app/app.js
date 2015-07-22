'use strict';

angular.module('foodmashApp', ['ngRoute', 'foodmashApp.controllers', 
	'foodmashApp.services', 'ngCookies', 'foodmashApp.directives', 'foodmashApp.resources', 
	'foodmashApp.interceptors', 'ngMaterial'])

.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
	$httpProvider.interceptors.push('UserAuthInterceptor');
	$routeProvider
	.when('/user/:user_id', 
	  {
	    templateUrl: '/templates/profile.html', 
	    controller: 'ProfileController',
	    resolve: {
	      user:
	      function($q, $route, $location, AuthService) {
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
		.when('/login', 
		{
			controller: 'LoginController',
			templateUrl: '/templates/login.html'
		})
		// .when('/movie/:movie_id',
		// 	{
		// 		controller: 'MovieController',
		// 		templateUrl: '/templates/movie.html'
		// 	}
		// )
		.when('/', 
		{
			controller: 'CombosController',
			templateUrl: '/templates/combos.html'
		}
		).otherwise({redirectTo: '/'});
		$locationProvider.html5Mode(true);
}]);
