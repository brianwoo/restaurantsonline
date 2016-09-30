'use strict';

angular.module('restaurantsOnlineApp', 
['ui.router', 'ngResource', 'angular-carousel', 'ngMap', 'ngDialog', 
 '720kb.datepicker', 'angular.filter', 'mgcrea.ngStrap'])
.constant("baseURL", "http://localhost:8443")

.config(function($stateProvider, $urlRouterProvider) {
   
   console.log("app.js");
   
   $stateProvider
   
   // route for the home page
   .state('app', {
      url:'/',
      views: {
         'header': {
            templateUrl: "views/header.html"
         },
         'content': {
            templateUrl: "views/home.html",
            // If enabled, the controller methods will be called twice.
            //controller: "HomeController"  
         },
         'footer': {
            templateUrl: "views/footer.html",
         }
      }
   })
   
   // route for the restaurantDetails page
   .state('app.restaurantDetails', {
      url:'restaurantDetails/:rid',
      views: {
         'content@': {
            templateUrl: "views/restaurantDetails.html",
            // If enabled, the controller methods will be called twice.
            //controller: "HomeController"  
         },
      }
   })
   
   
   // route for the reservations page
   .state('app.reservations', {
      url:'reservations/:rid?name',
      views: {
         'content@': {
            templateUrl: "views/reservations.html",
            // If enabled, the controller methods will be called twice.
            //controller: "HomeController"  
         },
      },
      data: {
         needLogin: true
      }
   })
   
   
   // route for the online ordering page
   .state('app.ordering', {
      url:'ordering/:rid?name',
      views: {
         'content@': {
            templateUrl: "views/ordering.html",
            // If enabled, the controller methods will be called twice.
            //controller: "HomeController"  
         },
      },
      data: {
         needLogin: true
      }
   })
   
   
   // route for the my orders page
   .state('app.myorders', {
      url:'myorders',
      views: {
         'content@': {
            templateUrl: "views/myorders.html",
            // If enabled, the controller methods will be called twice.
            //controller: "HomeController"  
         },
      },
      data: {
         needLogin: true
      }
   })
   
   // route for the my reservations page
   .state('app.myreservations', {
      url:'myreservations',
      views: {
         'content@': {
            templateUrl: "views/myreservations.html",
            // If enabled, the controller methods will be called twice.
            //controller: "HomeController"  
         },
      },
      data: {
         needLogin: true
      }
   })
   
   
   ;
   
   $urlRouterProvider.otherwise('/');
   
})


;