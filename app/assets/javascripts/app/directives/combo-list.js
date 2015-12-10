'use strict';

angular.module('foodmashApp.directives')

.directive('comboList', ['Combo', '$q', 'toaster', '$location', 'Upload', 'Aws', function(Combo, $q, toaster, $location, Upload, Aws){

	return {

		restrict: 'E',

		templateUrl: '/templates/combo-list.html',

		controller: ['$scope', 'Combo', '$q', 'toaster', '$location', 'Upload', 'Aws', function($scope, Combo, $q, toaster, $location, Upload, Aws){

			$scope.updatedCombo = new Combo;

			$scope.routeToCombo = function(combo){
				$location.path("/combos/" + combo.id);
			};

			$scope.updateActiveState = function(combo, active){
				var d = $q.defer();
				combo.update({active: active}).then(function(response){
					toaster.pop('success', 'Combo was updated!');
					var index = $scope.combos.indexOf(combo);
					if(angular.isNumber(index) && index >= 0){
						$scope.combos[index] = combo;
					}
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not updated!');
					combo.active = !combo.active;
					d.reject(err);
				});
				return d.promise;
			};

			$scope.setUpdate = function(combo){
				$scope.updatedCombo = angular.copy(combo);
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

			$scope.updateCombo = function(combo, updateCross){
				var d = $q.defer();
				if(!updateCross){
					if(!$scope.comboUpdateForm.$pristine){
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
					}else{
						$scope.updatedCombo = new Combo;
						d.resolve(null);
					}
				}
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