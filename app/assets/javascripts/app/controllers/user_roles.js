'use strict';

angular.module('foodmashApp.controllers')

.controller('UserRolesController', ['$scope', 'toaster', '$q', 'User','Restaurant', function($scope, toaster, $q, User, Restaurant){

	$scope.users = {};
	$scope.role_names = ["super_admin", "packaging_centre_admin", "restaurant_admin", "customer"];
	$scope.resources = {};
	$scope.resource = {};
	$scope.user = {};
	$scope.role_name = "";

	User.query().then(function(users){
		if(users.length > 0){
			$scope.users = users;
		}else{
			$scope.users = new Array;
		}
	}, function(err){
		$scope.users = null;
	});

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

	function findUser(user){
		for(var i=0;i<$scope.users.length;i++){
			if($scope.users[i].id == user.id){
				return i;
			}
		};
		return -1;
	};

}]);