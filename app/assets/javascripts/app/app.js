'use strict';

angular.module('foodmashApp', ['ngRoute', 'foodmashApp.resources', 
	'foodmashApp.services', 'ngCookies', 'foodmashApp.directives', 'foodmashApp.controllers', 
	'foodmashApp.interceptors', 'toaster', 'ngFileUpload', 'ngSanitize'])

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
	          	toaster.pop('error', 'Unauthorized!');
	            $location.path('/');
	          }
	        });
	        
	        return d.promise;
	      }
	    }
	  })
		.when('/cartPayment', {
			controller: 'CartPaymentController',
			templateUrl: '/templates/cart_payment.html',
			resolve: {
				cart_payment: 
				function(AuthorizeService){
					AuthorizeService.checkForLogin();
				}
			}
		})
		.when('/checkout', {
			controller: 'CheckoutController', 
			templateUrl: '/templates/checkout.html',
			resolve: {
				checkout: 
				function(AuthorizeService){
					AuthorizeService.checkForLogin();
				}
			}
		})
		.when('/userRoles', {
			controller: 'UserRolesController',
			templateUrl: '/templates/user_roles.html',
			resolve: {
				user_roles: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
		})
		.when('/cart', {
			controller: 'CartController',
			templateUrl: '/templates/cart.html'
		})
		.when('/comboOptions/:id', {
			controller: 'ComboOptionController',
			templateUrl: '/templates/combo_option.html',
			resolve: {
				combo_option: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
		})
		.when('/combos', {
			controller: 'CombosController',
			templateUrl: '/templates/combos.html',
			resolve: {
				combos: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
		})
		.when('/packagingCentres', {
			controller: 'PackagingCentresController',
			templateUrl: '/templates/packaging_centres.html',
			resolve: {
				packaging_centres:
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
		})
		.when('/cities', {
			controller: 'CitiesController',
			templateUrl: '/templates/cities.html',
			resolve: {
				cities: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
		})
		.when('/cities/:id/areas', {
			controller: 'AreasController',
			templateUrl: '/templates/areas.html',
			resolve: {
				areas: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
		})
		.when('/combos/:id', {
			controller: 'ComboController',
			templateUrl: '/templates/combo.html',
			resolve: {
				combo: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
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
		.when('/dishTypes', {
			controller: 'DishTypesController',
			templateUrl: '/templates/dish_types.html',
			resolve: {
				dish_types: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
		})
		.when('/cuisines', {
			controller: 'CuisinesController',
			templateUrl: '/templates/cuisines.html',
			resolve: {
				cuisines: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
		})
		.when('/restaurants', {
			controller: 'RestaurantsController',
			templateUrl: '/templates/restaurants.html',
			resolve: {
				restaurants: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
				}
			}
		})
		.when('/restaurants/:id', {
			controller: 'RestaurantController', 
			templateUrl: '/templates/restaurant.html',
			resolve: {
				restaurant: 
				function(AuthorizeService){
					AuthorizeService.authorizeRouteForSuperAdmin();
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
