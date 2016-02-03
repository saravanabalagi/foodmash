'use strict';

angular.module('foodmashApp.directives')

.directive('combos', ['toaster', 'Combo', '$q', 'PackagingCentre', function(toaster, Combo, $q, PackagingCentre){

	return {

		restrict: 'E',

		templateUrl: '/templates/combos.html',

		controller: ['$scope', 'toaster', 'Combo', '$q', 'PackagingCentre', function($scope, toaster, Combo, $q, PackagingCentre){

			$scope.combo = new Combo;
			$scope.combos = {};
			$scope.loadingCombos = true;

			$scope.activeOptions = 
			[
				{icon_class: "fa fa-times-circle", value: false},
				{icon_class: "fa fa-check-circle", value: true}
			];
			$scope.combo.active = $scope.activeOptions[0].value;

			$scope.categoryOptions = 
			[
				{name: "regular", icon_class: "fa fa-cutlery"},
				{name: "budget", icon_class: "fa fa-coffee"},
				{name: "corporate", icon_class: "fa fa-sitemap"},
				{name: "health", icon_class: "fa fa-heartbeat"}
			];
			$scope.combo.category =  $scope.categoryOptions[0].name;

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

			$scope.addCombo = function(){
				var d = $q.defer();
                console.log($scope.combo);
				$scope.combo.save().then(function(response){
					toaster.pop('success', 'Combo was created!');
					$scope.combos.unshift($scope.combo);
					$scope.combo = new Combo;
					d.resolve(response);
				}, function(err){
					toaster.pop('error', 'Combo was not created!');
					d.reject(err);
				});
				return d.promise;
			};

		}]

	};

}]);