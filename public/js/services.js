'use strict';

var ORDERS = "restaurantsOnlineOrders";


angular.module("restaurantsOnlineApp")

/*******************************
* Restaurant Factory
********************************/
.service("restaurantFactory", ['$resource', 'baseURL', 
                               function($resource, baseURL) {
   
   this.getRestaurants = function() {
      
      return $resource("/api/restaurants", null);
   };
   
   
   this.getRestaurantById = function() {
     
      return $resource("/api/restaurants/:rid", null);
      
   };
   
   
}])

/*******************************
* Cuisine Category Factory
********************************/
.service("cuisineCategoryFactory", ['$resource', 'baseURL', function($resource, baseURL) {

   this.getCuisineCategories = function() {
      
      return $resource("/api/cuisinecategories", null);
      
   };
   
}])

/*******************************
* local storage Factory
********************************/
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
            $window.localStorage[key] = angular.toJson(value);
        },
        getObject: function (key, defaultValue) {
           
            //console.log("storage=", $window.localStorage[key]);
            if ($window.localStorage[key] == undefined)
               return defaultValue;
           
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])

/*******************************
* User Factory
********************************/
.service("userFactory", 
         ['$resource', '$http', 'baseURL', '$localStorage', '$window', 
         function($resource, $http, baseURL, $localStorage, $window) {

            
   var TOKEN_KEY = 'restaurantsOnlineToken';
   var isAuthenticated = false;
   var userFirstname = '';
   var authToken = undefined;          
   var isRestaurantMgr = false;
            
   this.login = function() {
      return $resource("/api/users/login", null, {'save':{method:'POST'}});
   };
            
            
   this.logout = function() {
      $resource("/api/users/logout").get(function(response) {});
      destroyUserCredentials();
      destroyAllOrders();
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
            
   this.isRestaurantMgr = function() {
      return isRestaurantMgr;
   };
   
   function useCredentials(credentials) {
      isAuthenticated = true;
      userFirstname = credentials.userFirstname;
      authToken = credentials.token;
      isRestaurantMgr = credentials.restaurantMgr;
 
      // Set the token as header for your requests!
      $http.defaults.headers.common['x-access-token'] = authToken;
   }
   
   function destroyAllOrders() {
      
      $localStorage.remove(ORDERS);
   }
            
   function loadUserCredentials() {
      
      console.log("loadUserCredentials");
      
      var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
      if (credentials.userFirstname != undefined) {
         useCredentials(credentials);
      }
   }
      
   function destroyUserCredentials() {
      authToken = undefined;
      userFirstname = '';
      isAuthenticated = false;
      $http.defaults.headers.common['x-access-token'] = authToken;
      $localStorage.remove(TOKEN_KEY);
   }
          
   this.storeUserCredentials = function(credentials) {
      $localStorage.storeObject(TOKEN_KEY, credentials);
      useCredentials(credentials);
   };       
            
   // automatically load all the user credentials from local storage.
   loadUserCredentials();
            
}])


/*******************************
* Timeslot Factory
********************************/
.service("timeslotFactory", 
         ['$resource', '$http', 'baseURL', 
         function($resource, $http, baseURL) {

   this.findByNumOfPeople = function() {
      
      return $resource("/api/restaurants/:rid/timeslots", null);
   };

                
}])


/*******************************
* Reservation Factory
********************************/
.service("reservationFactory", 
         ['$resource', '$http', 'baseURL', 
         function($resource, $http, baseURL) {
 
   this.makeReservation = function(rid) {
      return $resource("/api/restaurants/:rid/reservations", {rid: rid});
   };
   
   this.getAllReservations = function() {
      return $resource("/api/reservations");
   };
   
   this.getAllReservationStatuses = function() {
      return $resource("/api/reservationstatuses");
   };
            
   this.updateReservationStatus = function(rsId) {
      return $resource("/api/reservations/:rsId", {rsId: rsId}, 
                       {'update': { method:'PUT' }}) 
   };
            
}])



/*******************************
* Foood Ordering Factory
********************************/
.service("orderingFactory", 
         ['$resource', '$http', 'baseURL', "$localStorage",
         function($resource, $http, baseURL, $localStorage) {
 
   //var ORDERS = "restaurantsOnlineOrders";
   // ORDERS_MAP is the data structure for REST call.
   var ORDERS_MAP = "map";
   // ORDERS_LIST is the data structure for screen display.
   var ORDERS_LIST = "list";            
            
   this.getFoodCategories = function(rid) {
      return $resource("/api/restaurants/:rid/menu/categories", {rid: rid});
   };
            
   this.getMenu = function(rid) {
      return $resource("/api/restaurants/:rid/menu", {rid: rid}); 
   };
            
   this.order = function(rid) {
      return $resource("/api/restaurants/:rid/orders", {rid: rid});
   };
   
   this.getAllOrders = function() {
      return $resource("/api/orders");
   };
   
   this.getAllOrderStatuses = function() {
      return $resource("/api/orderstatuses");
   };
            
   this.updateOrderStatus = function(oid) {
      return $resource("/api/orders/:oid", {oid: oid}, {'update': { method:'PUT' }});
   };
            
   
   // Storing order lists
   this.storeOrdersObjects = function(restaurant, basketForSubmission, orderListForDisplay) {
      
      var ordersInStorage = $localStorage.getObject(ORDERS, {});
      
      console.log("here storeOrdersObjects");
      
      // to make each order unique per restaurant, 
      // we have to append the restaurant id to the key.
      ordersInStorage[ORDERS_MAP  + "_" + restaurant] = basketForSubmission;
      ordersInStorage[ORDERS_LIST + "_" + restaurant] = orderListForDisplay;
      
      $localStorage.storeObject(ORDERS, ordersInStorage);
   };
            
   // Getting orders object for submission
   this.getOrdersObjectForSubmission = function(restaurant) {
      
      var ordersInStorage = $localStorage.getObject(ORDERS, {});
      var obj = ordersInStorage[ORDERS_MAP + "_" + restaurant];
      
      if (obj == null)
         return {};
      
      return obj;
   };
            
   // Getting orders object for display
   this.getOrdersObjectForDisplay = function(restaurant) {
      
      var ordersInStorage = $localStorage.getObject(ORDERS, {});
      var obj = ordersInStorage[ORDERS_LIST + "_" + restaurant];
      
      if (obj == null)
         return [];
      
      return obj;
   };
            
   // Remove order after submission
   this.removeOrder = function(restaurant) {
      
      var ordersInStorage = $localStorage.getObject(ORDERS, {});
      
      delete ordersInStorage[ORDERS_MAP + "_" + restaurant];
      delete ordersInStorage[ORDERS_LIST + "_" + restaurant];
      
      $localStorage.storeObject(ORDERS, ordersInStorage);
   };
   
}])


;