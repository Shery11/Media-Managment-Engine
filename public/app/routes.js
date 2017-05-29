app.config(['$locationProvider','$routeProvider','$stateProvider','$urlRouterProvider', function ($locationProvider,$routeProvider,$stateProvider,$urlRouterProvider) {

   $locationProvider.hashPrefix('');
         $stateProvider.state('homeControl', {
            url:'/',
            templateUrl: 'app/modules/home/home.html',
            controller:'homeCtrl'
          }).state('adminControl', {
            url:'/profile',
            templateUrl: 'app/modules/admin/admin.html',
            controller:'adminCtrl',
             resolve: {
                userAuthenticated: ["$http", "$q", function($http, $q) {
                    var deferred = $q.defer();
                    if(firebase.auth().currentUser) {
                        deferred.resolve(); 
                    } else {
                        deferred.reject('NOT_AUTHORIZED');

                    }
                    return deferred.promise;
                }]
            }
          })
          .state('signin', {
            url:'/signin',
            templateUrl: 'app/modules/form/signin.html',
            controller:'homeCtrl'
          })
          .state('signup', {
            url:'/signup',
            templateUrl: 'app/modules/form/signup.html',
            controller:'homeCtrl'
          });

           $urlRouterProvider.otherwise('/');
    
}]);
