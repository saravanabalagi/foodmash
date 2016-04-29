'use strict';

angular.module('foodmashApp.directives')

.directive('restaurant', ['Restaurant', '$q', '$location', 'toaster', 'Upload', 'Aws', 'Areas', function(Restaurant, $q, $location, toaster, Upload, Aws, Areas){

	return {

		restrict: 'A',

		templateUrl: '/templates/restaurant.html',

		controller: ['$scope', 'Restaurant', '$q', '$location', 'toaster', 'Upload', 'Aws', 'Areas', function($scope, Restaurant, $q, $location, toaster, Upload, Aws, Areas){

			$scope.updatedRestaurant = new Restaurant;

			$scope.selectAreaForUpdate = function(area){
				$scope.selectedAreaForUpdate = area;
				$scope.updatedRestaurant.area_id = area.id;
			};
		
			$scope.routeToRestaurant = function(restaurant){
				$location.path("/restaurants/" + restaurant.id);
			};

			$scope.setUpdate = function(restaurant){
				$scope.updatedRestaurant = angular.copy(restaurant);
			};

			$scope.uploadFilesForRestaurant = function(file, errFiles, restaurant){
				if(file){
					Aws.loadAWS().then(function(aws){
						file.upload = Upload.upload({
						    url: 'https://foodmash-india.s3.amazonaws.com/', //S3 upload url including bucket name
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
							$scope.updatedRestaurant.logo = 'https://foodmash-india.s3.amazonaws.com/' + response.config.data.key;
							$scope.updatedRestaurant.update().then(function(response){
								toaster.pop('success', 'Restaurant logo pic was updated!');
								var index = $scope.restaurants.indexOf(restaurant);
								if(angular.isNumber(index) && index >= 0){
									$scope.restaurants[index] = $scope.updatedRestaurant;
								}
							}, function(err){
								toaster.pop('error', 'Restaurant logo pic was not updated!');
							});
						});
					});
					$scope.file = file;
				}
			};

			$scope.updateRestaurant = function(restaurant){
				var d = $q.defer();
				$scope.updatedRestaurant.update().then(function(response){
					toaster.pop('success', 'Restaurant was updated!');
					var index = $scope.restaurants.indexOf(restaurant);
					if(angular.isNumber(index) && index >= 0){
						$scope.restaurants[index] = $scope.updatedRestaurant;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Restaurant failed to update!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.deleteRestaurant = function(restaurant){
				var d = $q.defer();
				if(confirm('Are you sure ?')){
					restaurant.delete().then(function(response){
						$scope.restaurants.splice($scope.restaurants.indexOf(restaurant), 1);
						toaster.pop('success', 'Restaurant was deleted!');
						d.resolve(response);
					}, function(err){
						toaster.pop('error', 'Restaurant was not deleted!');
						d.reject(err);
					});
				}
				return d.promise;
			};


		}]

	};

}]);