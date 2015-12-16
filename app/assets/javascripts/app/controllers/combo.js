'use strict';

angular.module('foodmashApp.controllers')

.controller('ComboController', ['$scope', 'Combo', '$location', '$routeParams', 'toaster', '$q','$timeout', 'Upload', 'Aws', function($scope, Combo, $location, $routeParams, toaster, $q, $timeout, Upload, Aws){

	$scope.combo = {};
	$scope.combo_options = {};
	$scope.updatedCombo = new Combo;

	Combo.query({id: $routeParams.id}).then(function(combos){
		if(combos.length > 0){
			$scope.combo = combos[0];
	    	$timeout(function(){
	    	    angular.element(document.querySelector('#load-combo-options')).triggerHandler('click');
	    	}, 0);

		    $timeout(function(){
		    	    angular.element(document.querySelector('#load-combo-dishes')).triggerHandler('click');
		    }, 0);
		}else{
			$scope.combo = null;
		}
	});

	$scope.setUpdate = function(combo){
		$scope.updatedCombo = angular.copy(combo);
	};

	$scope.uploadFiles = function(file, errFiles, combo){
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
					$scope.combo.picture = 'https://foodmash.s3.amazonaws.com/' + response.config.data.key;
					$scope.combo.update().then(function(response){
						toaster.pop('success', 'Combo was updated!');
					}, function(err){
						toaster.pop('error', 'Combo was not updated!');
					});
				});
			});
			$scope.file = file;
		}
	};

	$scope.updateCombo = function(updateCross){
		var d = $q.defer();
		if(!updateCross){
			if(!$scope.comboUpdateForm.$pristine){
				$scope.updatedCombo.update().then(function(response){
					toaster.pop('success', 'Combo was updated!');
					$scope.combo = $scope.updatedCombo;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not updated!');
					d.reject(err);
				});
			}else{
				d.resolve(null);
			}
		}
	};

	$scope.deleteCombo = function(){
		var d = $q.defer();
		$scope.combo.delete().then(function(response){
			toaster.pop('success', 'Combo was deleted!');
			$location.path('/combos');
		}, function(err){
			toaster.pop('error', 'Combo was not deleted!');
			d.reject(err);
		});
	};

}]);