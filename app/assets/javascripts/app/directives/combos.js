'use strict';

angular.module('foodmashApp.directives')

.directive('combos', ['toaster', 'Combo', '$rootScope', '$q', 'PackagingCentre', 'Aws', 'Upload', 'ComboService', function(toaster, Combo, $rootScope, $q, PackagingCentre, Aws, Upload, ComboService){

	return {

		restrict: 'E',

		templateUrl: '/templates/combos.html',

		controller: ['$scope', 'toaster', 'Combo', '$rootScope', '$q', 'PackagingCentre', 'Aws', 'Upload', 'ComboService', function($scope, toaster, Combo, $rootScope, $q, PackagingCentre, Aws, Upload, ComboService){

			$scope.combo = new Combo;
			$scope.combos = [];
			$scope.packaging_centres = [];
			$scope.loadingCombos = true;

			ComboService.getDishTypesForCombo().then(function(dish_types){
				var dish_types = dish_types;
			}, function(err){
				var dish_types = null;
			});

			ComboService.getRestaurantsForCombo($rootScope.area.packaging_centre_id).then(function(restaurants){
				var restaurants = restaurants;
			}, function(err){
				var restaurants = null;
			});

			$scope.activeOptions = 
			[
				{icon_class: "fa fa-times-circle", value: false},
				{icon_class: "fa fa-check-circle", value: true}
			];
			$scope.combo.active = $scope.activeOptions[0].value;

			$scope.categoryOptions = 
			[
				{name: "Regular", icon_class: "fa fa-cutlery"},
				{name: "Budget", icon_class: "fa fa-coffee"},
				{name: "Corporate", icon_class: "fa fa-sitemap"},
				{name: "Health", icon_class: "fa fa-heartbeat"}
			];
			$scope.combo.category =  $scope.categoryOptions[0].name;

			$scope.$watch('loadCombos', function(n, o){
				if(n){
					Combo.query().then(function(combos){
						if(combos.length > 0){
							$scope.combos = combos;
						}else{
							$scope.combos = new Array;
						}
						$scope.loadingCombos = false;
					}, function(err){
						$scope.combos = null;
						$scope.loadingCombos = false;
					});

					PackagingCentre.query().then(function(packaging_centres){
						if(packaging_centres.length > 0){
							$scope.packaging_centres = packaging_centres;
						}else{
							$scope.packaging_centres = null;
						}
					}, function(err){
						$scope.packaging_centres = null;
					});
				}
			});

            $scope.selectPackagingCentre = function(packaging_centre){
                $scope.selectedPackagingCentre = packaging_centre;
                $scope.combo.packaging_centre_id = packaging_centre.id;
            };

			$scope.toggleCategoryOption = function(){
				if(typeof($scope.toggleCategoryOption.counter) == 'undefined'){
					$scope.toggleCategoryOption.counter = 1;
				}else{
					$scope.toggleCategoryOption.counter+=1;
				}
				$scope.combo.category = $scope.categoryOptions[$scope.toggleCategoryOption.counter % 4].name;
			};

			$scope.toggleActiveOption = function(){
				if(typeof($scope.toggleActiveOption.counter) == 'undefined'){
					$scope.toggleActiveOption.counter = 1;
				}else{
					$scope.toggleActiveOption.counter += 1;
				}
				$scope.combo.active = $scope.activeOptions[$scope.toggleActiveOption.counter % 2].value;
			};

			$scope.getIconForActive = function(combo){
				var icon_class = "";
				$scope.activeOptions.filter(function(ac){
					if(ac.value == combo.active){
						icon_class = ac.icon_class;
					}
				});
				return icon_class;
			};

			$scope.getIconForCategory = function(combo){
				var icon_class = "";
				$scope.categoryOptions.filter(function(cat){
					if(cat.name == combo.category){
						icon_class = cat.icon_class;
					}
				});
				return icon_class;
			};

			$scope.uploadFilesForCombos = function(file, errFiles){
				if(file){
					Aws.loadAWS().then(function(aws){
						file.upload = Upload.upload({
						    url: 'https://foodmash-india.s3.amazonaws.com/', //S3 upload url including bucket name
						    method: 'POST',
						    data: {
						        key: 'images/combos/' + Date.now() + '/' + file.name, // the key to store the file on S3, could be file name or customized
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
							$scope.combo.picture = 'https://foodmash-india.s3.amazonaws.com/' + response.config.data.key;
							toaster.pop('success', 'Combo pic uploaded!');
						});
					});
					$scope.file = file;
				}
			};

			$scope.addCombo = function(){
				var d = $q.defer();
				$scope.combo.save().then(function(response){
					toaster.pop('success', 'Combo was created!');
					$scope.combos.unshift($scope.combo);
					$scope.combo = new Combo;
					renewSelectedValues();
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not created!');
					d.reject(err);
				});
				return d.promise;
			};

			function renewSelectedValues(){
				$scope.combo.packaging_centre_id = $scope.selectedPackagingCentre.id;
			};

		}]

	};

}]);