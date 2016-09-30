'use strict';

angular.module("restaurantsOnlineApp")
.service("restaurantFactory", ['$resource', 'baseURL', function($resource, baseURL) {

   this.getRestaurants = function() {
      
      return $resource("/api/restaurants", null);
      
   };
   
   
   this.getRestaurantById = function() {
     
      return $resource("/api/restaurants/:rid", null);
      
   };
   
   
}])


.service("cuisineCategoryFactory", ['$resource', 'baseURL', function($resource, baseURL) {

   this.getCuisineCategories = function() {
      
      return $resource("/api/cuisinecategories", null);
      
   };
   
}])


.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])


.service("userFactory", 
         ['$resource', '$http', 'baseURL', '$localStorage', '$window', 
         function($resource, $http, baseURL, $localStorage, $window) {

            
   var TOKEN_KEY = 'restaurantsOnlineToken';
   var isAuthenticated = false;
   var userFirstname = '';
   var authToken = undefined;            
            
   this.login = function() {
      return $resource("/api/users/login", null, {'save':{method:'POST'}});
   };
            
            
   this.logout = function() {
      $resource("/api/users/logout").get(function(response) {});
      destroyUserCredentials();
   };
   
   this.register = function(registerData) {
      return $resource("/api/users/register");
   };
   
   this.isAuthenticated = function() {
      return isAuthenticated;
   };
            
   this.getUserFirstname = function() {
      return userFirstname;
   };
   
   function useCredentials(credentials) {
      isAuthenticated = true;
      userFirstname = credentials.userFirstname;
      authToken = credentials.token;
 
      // Set the token as header for your requests!
      $http.defaults.headers.common['x-access-token'] = authToken;
   };
   
   
   function loadUserCredentials() {
      var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
      if (credentials.userFirstname != undefined) {
         useCredentials(credentials);
      }
   };
     
   
   function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      isAuthenticated = false;
      $http.defaults.headers.common['x-access-token'] = authToken;
      $localStorage.remove(TOKEN_KEY);
   };
          
   // automatically load all the user credentials from local storage.
   loadUserCredentials();
            
}])


;


function getCostIndicator(low, high) {
      
   if (low <=15 && high <= 50)
      return "$";
   
   if (high <= 50)
      return "$$";
   
   if (high > 50)
      return "$$$";   
}