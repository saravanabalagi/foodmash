'use strict';

angular.module('foodmashApp.directives')

.directive('dishes', ['Dish', '$q', 'toaster', 'DishType', 'Cuisine', 'Upload', 'Aws', function(Dish, $q, toaster, DishType, Cuisine, Upload, Aws){

	return {

		restrict: 'A',

		templateUrl: '/templates/dishes.html',

		controller: ['$scope', 'Dish', '$q', 'toaster', 'DishType', 'Cuisine','Upload', 'Aws', function($scope, Dish, $q, toaster, DishType, Cuisine, Upload, Aws){

			$scope.dish_types = [];
			$scope.cuisines = [];
			$scope.dishes = [];
			$scope.labels = [{name: "Veg", value: "veg"}, {name: "Egg", value: "egg"}, {name: "Non Veg", value: "non-veg"}];
			$scope.dish = new Dish;

			DishType.query().then(function(dish_types){
				if(dish_types.length > 0){
				  $scope.dish_types = dish_types;		
				}else{
				  $scope.dish_types = null;
				}
			}, function(err){
				$scope.dish_types = null;
			});

			Cuisine.query().then(function(cuisines){
				if(cuisines.length > 0){
				  $scope.cuisines = cuisines;		
				}else{
				  $scope.cuisines = null;
				}
			}, function(err){
				$scope.cuisines = null;
			});

			$scope.$watch('restaurant', function(n, o){
				if(n.id){
					if($scope.restaurant.dishes && $scope.restaurant.dishes.length > 0){
						$scope.restaurant.dishes.filter(function(d){
							$scope.dishes.push(new Dish(d));
						});
					}else{
						$scope.dishes = new Array;
					}
				}
			});

			$scope.selectDishType = function(dish_type){
				$scope.selectedDishType = dish_type;
				$scope.dish.dish_type_id = dish_type.id;
			};

			$scope.selectCuisine = function(cuisine){
				$scope.selectedCuisine = cuisine;
				$scope.dish.cuisine_id = cuisine.id;
			};

			$scope.selectLabel = function(label){
				$scope.selectedLabel = label;
				$scope.dish.label = label.value;
			};

			$scope.uploadFiles = function(file, errFiles){
				if(file){
					Aws.loadAWS().then(function(aws){
						file.upload = Upload.upload({
						    url: 'https://foodmash-india.s3.amazonaws.com/', //S3 upload url including bucket name
						    method: 'POST',
						    data: {
						        key: 'images/dishes/' + Date.now() + '/' + file.name, // the key to store the file on S3, could be file name or customized
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
						
							$scope.dish.picture = 'https://foodmash-india.s3.amazonaws.com/' + response.config.data.key;
							toaster.pop('success', 'Dish pic was uploaded!');
							
						});
					});
					$scope.file = file;
				}
			};

			$scope.addDish = function(restaurant_id){
				var d = $q.defer();
				$scope.dish.restaurant_id = restaurant_id;
				$scope.dish.save().then(function(response){
					toaster.pop('success', 'A new Dish was created!');
					$scope.dishes.unshift($scope.dish);
					$scope.dish = new Dish;
					renewSelectedValues();
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Dish was not created!');
					d.reject(err);
				});
				return d.promise;
			};

			function renewSelectedValues(){
				$scope.dish.dish_type_id = $scope.selectedDishType.id;
				$scope.dish.cuisine_id = $scope.selectedCuisine.id;
				$scope.dish.label = $scope.selectedLabel.value;
			};

		}]

	};

}]);