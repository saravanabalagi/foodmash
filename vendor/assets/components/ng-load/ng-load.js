(function(angular){

    angular.module('ngLoad', ['ng'])
    
    .directive('ngLoad', ['$parse', function($parse){

        return {
            restrict: 'A',
            link: function(scope, ele, attr){
                var fn = $parse(attr.ngLoad);
                ele.on('load', function(e, row_id){
                    console.log('hello');
                    scope.$apply(function(){
                        fn(scope, {restaurant_id: null});
                    });
                });
            }
        };

    }]);

    
})(angular);