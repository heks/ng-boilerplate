angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.clients',
  'ngBoilerplate.transactions',
  'ngBoilerplate.dailylog',
  'ngBoilerplate.invoice',
  'services.i18nNotifications',
  'ui.state',
  'security',
  'services.httpRequestTracker',
  'ui.utils'
  ])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise('/clients');
  /*
  $stateProvider.state( 'login', {
    url: '/',
    views: {
      "main": {
        templateUrl: '<h3> Please Log In </h3>'
      }
    }
  });
  */
})

.constant('I18N.MESSAGES', {
  'errors.route.changeError':'Route change error',
  'crud.user.save.success':"A user with id '{{id}}' was saved successfully.",
  'crud.user.remove.success':"A user with id '{{id}}' was removed successfully.",
  'crud.user.remove.error':"Something went wrong when removing user with id '{{id}}'.",
  'crud.user.save.error':"Something went wrong when saving a user...",
  'crud.project.save.success':"A project with id '{{id}}' was saved successfully.",
  'crud.project.remove.success':"A project with id '{{id}}' was removed successfully.",
  'crud.project.save.error':"Something went wrong when saving a project...",
  'login.reason.notAuthorized':"You do not have the necessary access permissions.  Do you want to login as someone else?",
  'login.reason.notAuthenticated':"You must be logged in to access this part of the application.",
  'login.error.invalidCredentials': "Login failed.  Please check your credentials and try again.",
  'login.error.serverError': "There was a problem with authenticating: {{exception}}."
})

/*
.config( function myAppConfig ( $stateProvider, $routeProvider ) {
  $routeProvider.when( '/login',
        {
            templateUrl:    '/login/login.tpl.html',
            controller:     'LoginCtrl'
        });
  $routeProvider.otherwise({redirectTo:'/clients'});

})
*/
.run( function run ( titleService,security ) {
  titleService.setSuffix( ' | Telekom' );
//  security.requestCurrentUser();
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, $state, security,  httpRequestTracker ) {

  $scope.telephone = '';

  $scope.isAuthenticated = security.isAuthenticated;
  $scope.isAdmin = security.isAdmin;  

  $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests();
  };

	$scope.isActive = function(route) {
		var x = $location.path().split('/');
        return route === '/' + x[1];
    };
});

