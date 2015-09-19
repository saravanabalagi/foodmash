'use strict';

angular.module('foodmashApp.controllers')

.controller('UserRolesController', ['$scope', 'toaster', '$q', 'User','Restaurant', function($scope, toaster, $q, User, Restaurant){

	$scope.users = {};
	$scope.role_names = ["super_admin", "packaging_centre_admin", "restaurant_admin"];
	$scope.resources = {};

	$scope.addUserRole = function(addCross){
		var d = $q.defer();
		if(!addCross){
			if(!$scope.userRoleAddForm.$pristine){
				User.addRole({id: $scope.user_id, role_name: $scope.role_name, resource_id: $scope.resource_id}).then(function(response){
					toaster.pop('success', 'User was assigned a new role!');
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'User was not assigned a new role!');
					d.reject(err);
				});
			}else{
				d.resolve(null);
			}
		}else{
			$scope.email = ""; $scope.role_name = {}; $scope.resource_id = {};
			d.resolve(null);
		}
		return d.promise;
	};

	$scope.searchUsers = function(){
		var d = $q.defer();
		User.findByEmail($scope.email).then(function(users){
			if(users.length > 0){
				d.resolve(users);
			}else{
				d.resolve(null);
			}
		}, function(err){
			d.reject(err);
		});
		return d.promise;
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

}]);