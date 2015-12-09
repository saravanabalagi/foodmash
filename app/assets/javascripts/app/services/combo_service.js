'use strict';

angular.module('foodmashApp.services')

.service('CombosService', ['$q', function($q, Combo){
  var service = this;
  var sideNavOptions = [
     {pic_url: "https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/offers.svg", name: "Offers", icon_class: "nav-icon offers"},
     {pic_url: "https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/for_1.svg", name: "Micro", icon_class: "nav-icon micro"},
     {pic_url: "https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/for_2.svg", name: "Medium", icon_class: "nav-icon medium"},
     {pic_url: "https://s3-ap-southeast-1.amazonaws.com/foodmash/assets/for_3.svg", name: "Mega", icon_class: "nav-icon mega"}
  ];

  this.loadSideNavOptions = function(){
    var d = $q.defer();
    if(sideNavOptions){
      d.resolve(sideNavOptions);
    }else{
      d.resolve(null);
    }
    return d.promise;
  };

}]);
