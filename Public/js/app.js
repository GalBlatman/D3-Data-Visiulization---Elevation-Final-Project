var app = angular.module('d3', ['ui.router'])
// app.directive("forceGraph", ['d3Service', function (d3Service) {
    // return {
    //   link: function(scope, element, attrs) {
    //     d3Service.data().then(function(data) {

    //     });
    //   }}
// }]);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('focus', {
      url: '/focus',
      templateUrl: '/templates/focus.html',
      controller: 'd3Ctrl',
      // resolve: {
      //   postPromise: ['d3Ctrl', function(data){
      //     return d3Service.getAll();
      //   }]
      //  }
    })
    // .state('evo', {
    //   url: '/evolution',
    //   templateUrl: '/templates/evolution.html',
    //   controller: 'd3EvoCtrl',
    //   // resolve: {
    //   //   post: ['$stateParams', 'posts', function($stateParams, posts) {
    //   //     return posts.get($stateParams.id);
    //   //   }]
    //   // }
    // })
    // .state('zoom', {
    //   url: '/zoom',
    //   templateUrl: '/templates/zoom.html',
    //   controller: 'd3ZoomCtrl',
    //   // resolve: {
    //   //   post: ['$stateParams', 'posts', function($stateParams, posts) {
    //   //     return posts.get($stateParams.id);
    //   //   }]
    //   // }
    // })


  $urlRouterProvider.otherwise('focus');
}]);
