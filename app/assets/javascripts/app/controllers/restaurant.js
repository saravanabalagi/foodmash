'use strict';

angular.module('foodmashApp.controllers')

.controller('RestaurantController', ['$scope','Restaurant','$routeParams','toaster','$q','$location','DishType','$timeout', 'Upload', 'Aws', 'Dish', function($scope, Restaurant, $routeParams, toaster, $q, $location, DishType, $timeout, Upload, Aws, Dish){
	$scope.restaurant = {};
	$scope.updatedRestaurant = new Restaurant;

	Restaurant.query({id: $routeParams.id}).then(function(restaurants){
		if(restaurants.length > 0){
			$scope.restaurant = restaurants[0];
			$timeout(function(){
				angular.element(document.querySelector('#load-dishes')).triggerHandler('click');
			}, 200);
		}else{
			$scope.restaurant = null;
		}
	});

	$scope.setUpdate = function(restaurant){
		$scope.updatedRestaurant = angular.copy(restaurant);
	};

	$scope.updateRestaurant = function(updateCross){
		var d = $q.defer();
		if(!updateCross){
			if(!$scope.restaurantUpdateForm.$pristine){
				$scope.updatedRestaurant.update().then(function(response){
					toaster.pop('success', 'Restaurant was updated!');
					$scope.restaurant = $scope.updatedRestaurant;
					d.resolve(response);
				}, function(err){
					toaster.pop('alert', 'Restaurant was not updated!');
					d.reject(err);
				});
			}else{
				d.resolve(null);
			}
		}
		return d.promise;
	};

	$scope.uploadFiles = function(file, errFiles, updatedRestaurant){
		if(file){
			Aws.loadAWS().then(function(aws){
				file.upload = Upload.upload({
				    url: 'https://foodmash.s3.amazonaws.com/', //S3 upload url including bucket name
				    method: 'POST',
				    data: {
				        key: 'images/restaurants/logo/' + Date.now() + '/' + file.name, // the key to store the file on S3, could be file name or customized
				        AWSAccessKeyId: aws.key,
				        acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
				        policy: aws.policy, // base64-encoded json policy (see article below)
				        signature: aws.signature, // base64-encoded signature based on policy string (see article below)
				        "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
				        file: file
				    }
				});

				file.upload.progress(function(e){ file.progress = Math.min(100, parseInt(100.0 * e.loaded/e.total)); });

				file.upload.then(function(response){
					$scope.updatedRestaurant.logo = 'https://foodmash.s3.amazonaws.com/' + response.config.data.key;
					$scope.updatedRestaurant.update().then(function(response){
						toaster.pop('success', 'Restaurant was updated!');
					}, function(err){
						toaster.pop('error', 'Restaurant was not updated!');
					});
				});
			});
			$scope.file = file;
		}
	};

	$scope.deleteRestaurant = function(){
		var d = $q.defer();
		$scope.restaurant.delete().then(function(response){
			toaster.pop('success', 'Restaurant was deleted!');
			d.resolve(response);
			$location.path("/restaurants");
		}, function(err){
			toaster.pop('alert', 'Restaurant was not deleted!');
			d.reject(err);
		});
		return d.promise;
	};

}]);