(function(angular){

    angular.module('ngLoad', ['ng'])
    
    .directive('ngLoad', ['$parse', function($parse){

        return {
            restrict: 'A',
            scope: true,
            link: function(scope, ele, attr){
                var fn = $parse(attr.ngLoad);
                ele.on('load', function(event, row_id){
                    console.log(row_id);
                    scope.$apply(function(){
                        fn(scope, {$event: event});
                    });
                });
            }
        };

    }]);

    
})(angular);