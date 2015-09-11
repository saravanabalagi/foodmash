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
					function($q, toaster, $rootScope, $location){
						var d = $q.defer();
						var check = false;
						if($rootScope.currentUser && $rootScope.currentUser.roles){
							$rootScope.currentUser.roles.filter(function(role){
								if(role.name == "super_admin"){
									check = true;
									d.resolve();
								}
							});
							if(!check){
								toaster.pop('error', "Unauthorized!");
								$location.path("/");
								d.reject(null);
							}
						}else{
							toaster.pop('error', "Not logged in!");
							$location.path("/login");
							d.reject(null);
						}
						return d.promise;
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
				function($q, toaster, $rootScope, $location){
					var d = $q.defer();
					var check = false;
					if($rootScope.currentUser && $rootScope.currentUser.roles){
						$rootScope.currentUser.roles.filter(function(role){
							if(role.name == "super_admin"){
								check = true;
								d.resolve();
							}
						});
						if(!check){
							toaster.pop('error', "Unauthorized!");
							$location.path("/");
							d.reject(null);
						}
					}else{
						toaster.pop('error', "Not logged in!");
						$location.path("/login");
						d.reject(null);
					}
					return d.promise;
				}
			}
		})
		.when('/combos', {
			controller: 'CombosController',
			templateUrl: '/templates/combos.html',
			resolve: {
				combos: 
				function($q, toaster, $rootScope, $location){
					var d = $q.defer();
					var check = false;
					if($rootScope.currentUser && $rootScope.currentUser.roles){
						$rootScope.currentUser.roles.filter(function(role){
							if(role.name == "super_admin"){
								check = true;
								d.resolve();
							}
						});
						if(!check){
							toaster.pop('error', "Unauthorized!");
							$location.path("/");
							d.reject(null);
						}
					}else{
						toaster.pop('error', "Not logged in!");
						$location.path("/login");
						d.reject(null);
					}
					return d.promise;
				}
			}
		})
		.when('/combos/:id', {
			controller: 'ComboController',
			templateUrl: '/templates/combo.html',
			resolve: {
				combo: 
				function($q, toaster, $rootScope, $location){
					var d = $q.defer();
					var check = false;
					if($rootScope.currentUser && $rootScope.currentUser.roles){
						$rootScope.currentUser.roles.filter(function(role){
							if(role.name == "super_admin"){
								check = true;
								d.resolve();
							}
						});
						if(!check){
							toaster.pop('error', "Unauthorized!");
							$location.path("/");
							d.reject(null);
						}
					}else{
						toaster.pop('error', "Not logged in!");
						$location.path("/login");
						d.reject(null);
					}
					return d.promise;
				}
			}
		})
		.when('/panel', {
			controller: 'PanelController',
			templateUrl: '/templates/panel.html',
			resolve: {
				panel: 
				function($q, toaster, $rootScope, $location){
					var d = $q.defer();
					var check = false;
					if($rootScope.currentUser && $rootScope.currentUser.roles){
						$rootScope.currentUser.roles.filter(function(role){
							if(role.name == "super_admin"){
								check = true;
								d.resolve();
							}
						});
						if(!check){
							toaster.pop('error', "Unauthorized!");
							$location.path("/");
							d.reject(null);
						}
					}else{
						toaster.pop('error', "Not logged in!");
						$location.path("/login");
						d.reject(null);
					}
					return d.promise;
				}
			}
		})
		.when('/dish_types', {
			controller: 'DishTypesController',
			templateUrl: '/templates/dish_types.html',
			resolve: {
				dish_types: 
				function($q, toaster, $rootScope, $location){
					var d = $q.defer();
					var check = false;
					if($rootScope.currentUser && $rootScope.currentUser.roles){
						$rootScope.currentUser.roles.filter(function(role){
							if(role.name == "super_admin"){
								check = true;
								d.resolve();
							}
						});
						if(!check){
							toaster.pop('error', "Unauthorized!");
							$location.path("/");
							d.reject(null);
						}
					}else{
						toaster.pop('error', "Not logged in!");
						$location.path("/login");
						d.reject(null);
					}
					return d.promise;
				}
			}
		})
		.when('/cuisines', {
			controller: 'CuisinesController',
			templateUrl: '/templates/cuisines.html',
			resolve: {
				cuisines: 
				function($q, toaster, $rootScope, $location){
					var d = $q.defer();
					var check = false;
					if($rootScope.currentUser && $rootScope.currentUser.roles){
						$rootScope.currentUser.roles.filter(function(role){
							if(role.name == "super_admin"){
								check = true;
								d.resolve();
							}
						});
						if(!check){
							toaster.pop('error', "Unauthorized!");
							$location.path("/");
							d.reject(null);
						}
					}else{
						toaster.pop('error', "Not logged in!");
						$location.path("/login");
						d.reject(null);
					}
					return d.promise;
				}
			}
		})
		.when('/restaurants', {
			controller: 'RestaurantsController',
			templateUrl: '/templates/restaurants.html',
			resolve: {
				restaurants: 
				function($q, toaster, $rootScope, $location){
					var d = $q.defer();
					var check = false;
					if($rootScope.currentUser && $rootScope.currentUser.roles){
						$rootScope.currentUser.roles.filter(function(role){
							if(role.name == "super_admin"){
								check = true;
								d.resolve();
							}
						});
						if(!check){
							toaster.pop('error', "Unauthorized!");
							$location.path("/");
							d.reject(null);
						}
					}else{
						toaster.pop('error', "Not logged in!");
						$location.path("/login");
						d.reject(null);
					}
					return d.promise;
				}
			}
		})
		.when('/restaurants/:id', {
			controller: 'RestaurantController', 
			templateUrl: '/templates/restaurant.html',
			resolve: {
				restaurant: 
				function($q, toaster, $rootScope, $location){
					var d = $q.defer();
					var check = false;
					if($rootScope.currentUser && $rootScope.currentUser.roles){
						$rootScope.currentUser.roles.filter(function(role){
							if(role.name == "super_admin"){
								check = true;
								d.resolve();
							}
						});
						if(!check){
							toaster.pop('error', "Unauthorized!");
							$location.path("/");
							d.reject(null);
						}
					}else{
						toaster.pop('error', "Not logged in!");
						$location.path("/login");
						d.reject(null);
					}
					return d.promise;
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
