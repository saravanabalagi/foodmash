'use strict';

angular.module('foodmashApp.directives')

.directive('restaurants', ['toaster', 'Restaurant', '$q', 'PackagingCentre', 'Areas', 'Aws', 'Upload', function(toaster, Restaurant, $q, PackagingCentre, Areas, Aws, Upload){

	return {

		restrict: 'E',

		templateUrl: '/templates/restaurants.html',

		controller: ['$scope', 'toaster', 'Restaurant', '$q', 'PackagingCentre', 'Areas', 'Aws', 'Upload', function($scope, toaster, Restaurant, $q, PackagingCentre, Areas, Aws, Upload){

			$scope.restaurant = new Restaurant;
			$scope.restaurants = [];
			$scope.loadingRestaurants = true;
			$scope.areas = [];

			Areas.query().then(function(areas){
				if(areas.length > 0){
					$scope.areas = areas;
				}else{
					$scope.areas = null;
				}
			}, function(err){
				$scope.areas = null;
			});

			Restaurant.query().then(function(restaurants){
				if(restaurants.length > 0){
					$scope.restaurants = restaurants;
				}else{
					$scope.restaurants = new Array;
				}
				$scope.loadingRestaurants = false;
			}, function(err){
				$scope.restaurants = null;
				$scope.loadingRestaurants = false;
			});

			$scope.selectArea = function(area){
				$scope.selectedArea = area;
				$scope.restaurant.area_id = area.id;
			};

			$scope.uploadFiles = function(file, errFiles){
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

						file.upload.progress(function(e){ file.progress = Math.min(100, parseInt(100.0*e.loaded/e.total)); });

						file.upload.then(function(response){
						
							$scope.restaurant.logo = 'https://foodmash-india.s3.amazonaws.com/' + response.config.data.key;
							toaster.pop('success', 'Restaurant logo pic was uploaded!');
							
						});
					});
					$scope.file = file;
				}
			};

			$scope.addRestaurant = function(){
				var d = $q.defer();
				$scope.restaurant.save().then(function(response){
					toaster.pop('success', 'Restaurant was created!');
					$scope.restaurants.unshift($scope.restaurant);
					$scope.restaurant = new Restaurant;
					renewSelectedValues();
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Restaurant was not created!');
					d.reject(err);
				});
				return d.promise;
			};

			function renewSelectedValues(){
				$scope.restaurant.area_id = $scope.selectedArea.id;
			};

		}]

	};

}]);