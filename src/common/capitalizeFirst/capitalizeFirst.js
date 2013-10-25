/* Directive to capitalize first letter of input */
angular.module('capitalizeFirst',[]).directive('capitalizeFirst', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if(inputValue) {
             var capitalized = inputValue.charAt(0).toUpperCase() +
                               inputValue.substring(1);
             if(capitalized !== inputValue) {
                modelCtrl.$setViewValue(capitalized);
                modelCtrl.$render();
              }         
              return capitalized;
            }
         };
         modelCtrl.$parsers.push(capitalize);
         capitalize(scope[attrs.ngModel]);  // capitalize initial value
     }
   };
});