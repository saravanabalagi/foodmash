'use strict';

angular.module('foodmashApp.directives')

.directive('userRole', ['$q', 'toaster', 'User', 'Restaurant','PackagingCentre', function($q, toaster, User, Restaurant, PackagingCentre){

	return {

		restrict: 'A',

		templateUrl: '/templates/user-role.html',

		controller: ['$scope', '$q', 'toaster','User','Restaurant','PackagingCentre', function($scope, $q, toaster, User, Restaurant, PackagingCentre){

			$scope.role_names = ["super_admin", "packaging_centre_admin", "restaurant_admin", "customer"];
			$scope.resources = [];
			$scope.resource = {};
			$scope.role_name = "";

			$scope.setUser = function(user){
				$scope.user = user;
			};

			$scope.setRoleName = function(rolename){
				$scope.role_name = rolename;
			};

			$scope.setResource = function(resource){
				$scope.resource = resource;
			};

			$scope.loadResources = function(){
				if($scope.role_name == "restaurant_admin"){
					$scope.loadRestaurants();
				}else if($scope.role_name == "packaging_centre_admin"){
					$scope.loadPackagingCentres();
				}
			};

			$scope.loadRestaurants = function(){
				var d = $q.defer();
				Restaurant.query().then(function(restaurants){
					if(restaurants.length > 0){
						$scope.resources = restaurants;
					}else{
						$scope.resources = null;
					}
					d.resolve(null);
				}, function(err){
					$scope.resources = null;
					d.reject(err);
				});
				return d.promise;
			};

			$scope.loadPackagingCentres = function(){
				var d = $q.defer();
				PackagingCentre.query().then(function(packaging_centres){
					if(packaging_centres.length > 0){
						$scope.resources = packaging_centres;
					}else{
						$scope.resources = null;
					}
					d.resolve(null);
				}, function(err){
					$scope.resources = null;
					d.reject(err);
				});
				return d.promise;
			};

			$scope.addUserRole = function(){
				var d = $q.defer();
				User.addRole($scope.user.id, $scope.role_name, $scope.resource.id).then(function(user){
					toaster.pop('success', 'User was assigned a new role!');
					var index = findUser($scope.user);
					if(angular.isNumber(index) && index >= 0){
						$scope.users[index] = user;
					}
					d.resolve(user);
				}, function(err){
					toaster.pop('error', 'User was not assigned a new role!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.removeRole = function(user, role){
				var d = $q.defer();
				if(confirm('Are you sure ?')){
					User.removeRole(user.id, role.name, role.resource_id).then(function(user){
						toaster.pop('success', 'Role was successfully removed from the user!');
						$scope.user = user;
						d.resolve(null);
					}, function(err){
						toaster.pop('error', 'Role was not deleted for the user!');
						d.reject(err);
					});
				}
				return d.promise;
			};

			function findUser(user){
				for(var i=0;i<$scope.users.length;i++){
					if($scope.users[i].id == user.id){
						return i;
					}
				};
				return -1;
			};

		}]

	};

}]);