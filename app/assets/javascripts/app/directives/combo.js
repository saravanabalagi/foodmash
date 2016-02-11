'use strict';

angular.module('foodmashApp.directives')

.directive('combo', ['Combo', '$q', 'toaster', '$location', 'Upload', 'Aws', 'PackagingCentre', function(Combo, $q, toaster, $location, Upload, Aws, PackagingCentre){

	return {

		restrict: 'A',

		templateUrl: '/templates/combo.html',

		controller: ['$scope', 'Combo', '$q', 'toaster', '$location', 'Upload', 'Aws', 'PackagingCentre', function($scope, Combo, $q, toaster, $location, Upload, Aws, PackagingCentre){

			$scope.updatedCombo = new Combo;
			$scope.categories = [{name: 'regular'}, {name: 'budget'}, {name: 'corporate'}, {name: 'health'}];
			$scope.packaging_centres = [];

			$scope.routeToCombo = function(combo){
				$location.path("/combos/" + combo.id);
			};

			$scope.toggleCategoryOptionForUpdate = function(){
				$scope.toggleCategoryOptionForUpdate.counter+=1;
				$scope.updatedCombo.category = $scope.categoryOptions[$scope.toggleCategoryOptionForUpdate.counter % 4].name;
			};

			$scope.toggleActiveOptionForUpdate = function(){
				$scope.toggleActiveOptionForUpdate.counter += 1;
				$scope.updatedCombo.active = $scope.activeOptions[$scope.toggleActiveOptionForUpdate.counter % 2].value;
			};

			PackagingCentre.query().then(function(packaging_centres){
				if(packaging_centres.length > 0){
					$scope.packaging_centres = packaging_centres;
				}else{
					$scope.packaging_centres = null;
				}
			}, function(err){
				$scope.packaging_centres = null;
			});

			$scope.updateActiveState = function(combo){
				var d = $q.defer();
				combo.active = !combo.active;
				combo.update().then(function(response){
					toaster.pop('success', 'Combo was updated!');
					var index = $scope.combos.indexOf(combo);
					if(angular.isNumber(index) && index >= 0){
						$scope.combos[index] = combo;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not updated!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.setUpdate = function(combo){
				$scope.updatedCombo = angular.copy(combo);
				$scope.toggleCategoryOptionForUpdate.counter = $scope.categoryOptions.filter(function(co){if($scope.updatedCombo.category == co.name){return $scope.categoryOptions.indexOf(co);} });
				$scope.toggleActiveOptionForUpdate.counter = $scope.updatedCombo.active == true ? 1 : 0;
			};

			$scope.uploadFiles = function(file, errFiles, updatedCombo){
				if(file){
					Aws.loadAWS().then(function(aws){
						file.upload = Upload.upload({
						    url: 'https://foodmash.s3.amazonaws.com/', //S3 upload url including bucket name
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
							$scope.updatedCombo.picture = 'https://foodmash.s3.amazonaws.com/' + response.config.data.key;
							$scope.updatedCombo.update().then(function(response){
								toaster.pop('success', 'Combo was updated!');
								var index = $scope.combos.indexOf(updatedCombo);
								if(angular.isNumber(index) && index >= 0){
									$scope.combos[index] = $scope.updatedCombo;
								}
							}, function(err){
								toaster.pop('error', 'Combo was not updated!');
							});
						});
					});
					$scope.file = file;
				}
			};

			$scope.selectPackagingCentreForUpdate = function(packaging_centre){
				$scope.updatedCombo.packaging_centre_id = packaging_centre.id;
				$scope.selectedPackagingCentreForUpdate = packaging_centre;
			};

			$scope.updateCombo = function(combo){
				var d = $q.defer();
				$scope.updatedCombo.update().then(function(response){
					toaster.pop('success', 'Combo was updated!');
					var index = $scope.combos.indexOf(combo);
					if(angular.isNumber(index) && index >= 0){
						$scope.combos[index] = $scope.updatedCombo;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not updated!');
					d.reject(err);
				});
				return d.promise;
			};

			$scope.deleteCombo = function(combo){
				var d = $q.defer();
				combo.delete().then(function(response){
					toaster.pop('success', 'Combo was deleted!');
					$scope.combos.splice($scope.combos.indexOf(combo), 1);
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not deleted!');
					d.reject(err);
				});
			};

		}]

	};

}]);