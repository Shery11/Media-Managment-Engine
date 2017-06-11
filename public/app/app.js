

let app = angular.module('myApp', [
	'ngRoute',
	'firebase',
	'ui.router',
	'faceServices','ngToast']);


app.run(['$rootScope','$state', function ($rootScope,$state) {
       
	$rootScope.hideX =false; 
	$rootScope.showX =false;
}])

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);


 app.config(['ngToastProvider', function(ngToast) {
    ngToast.configure({
       horizontalPosition: 'left',
       verticalPosition: 'bottom'
      
    });
  }]);

