'use strict';

angular.module("restaurantsOnlineApp")

/*************************************
* Home Controller
*************************************/
.controller(
   "HomeController", 
   ['$scope', "restaurantFactory", "cuisineCategoryFactory",
   function($scope, restaurantFactory, cuisineCategoryFactory) {
   
            
   // Get all restaurants
   $scope.restaurants = restaurantFactory.getRestaurants().query()
   .$promise.then(function(response) {
   
      //console.log("restaurants=", response);                       
      $scope.restaurants = response;
   });
                                  
   
   //Get all Cuisine Categories
   $scope.cuisineCategories = cuisineCategoryFactory.getCuisineCategories().query()
   .$promise.then(function(response) {
   
      //console.log("cuisineCategories=", response);
      $scope.cuisineCategories = response;
   });   
            
      
      
   $scope.isActive = function(categoryId) {
      
      return (categoryId === $scope.selectedCategoryId);
   };
   
   /*
   $scope.categorySelected = {};
   $scope.selectCategory = function(category) {
      
      $scope.categorySelected = {cuisineCategory: category};
      console.log("category=" + JSON.stringify($scope.categorySelected));
   }
   */
      
   $scope.getCostIndicator = getCostIndicator;  
   
   $scope.selectedCategory = "All";
   $scope.selectedCategoryId = "";
   $scope.cuisineCategoryFilter = {};
      
   $scope.selectCategory = function (item) {
 
      $scope.selectedCategory = item.desc;
      $scope.selectedCategoryId = item.id;
      $scope.cuisineCategoryFilter = {cuisineCategory: item.id};
      //alert("selectedCategory=" + $scope.selectedCategory + ", id=" + $scope.selectedCategoryId + ", filter=" + JSON.stringify($scope.cuisineCategoryFilter));
   };
   
   
            
}])

/*************************************
* Restaurant Details Controller
*************************************/
.controller(
   "RestaurantDetailsController", 
   ['$scope', '$stateParams', "restaurantFactory", 'NgMap', '$state', 'userFactory', 'ngDialog',
   function($scope, $stateParams, restaurantFactory, NgMap, $state, userFactory, ngDialog) {

   $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyBItpeQklbV6onKwnAZKlf8uXQux17sxR8";   
      
   NgMap.getMap().then(function(map) {
      //console.log(map.getCenter());
      //console.log('markers', map.markers);
      //console.log('shapes', map.shapes);
   });
      
   $scope.latAndLon = "";   
      
   $scope.restaurantDetails =  restaurantFactory.getRestaurantById().get({rid: $stateParams.rid})
   .$promise.then(function(response) {
   
      console.log("restaurant=", response); 
      $scope.restaurantDetails = response;
      $scope.latAndLon = response.lat + "," + response.lon;
      //restaurantFactory.setRestaurantInfo(response._id, response.name);
      //console.log($scope.latAndLon);
   });
      
      
   $scope.getCostIndicator = getCostIndicator;   
      
   // Reservations
   $scope.goToReservations = function() {
      
      var stateToTransition = {state: "app.reservations", 
                               param: {rid: $scope.restaurantDetails._id,
                                       name: $scope.restaurantDetails.name}
                              };
      
      if (checkIsLoggedIn(userFactory, $scope)) {
         console.log("true:" + JSON.stringify(stateToTransition));
         stateGo($state, stateToTransition);
      }
      else {
         console.log("false");
         openLoginRegisterDialog(ngDialog, stateToTransition);
      }
         
   };
      
      
   // Online Ordering
   $scope.goToOrdering = function() {
     
      var stateToTransition = {state: "app.ordering", 
                               param: {rid: $scope.restaurantDetails._id,
                               name: $scope.restaurantDetails.name}
                              };
      
      if (checkIsLoggedIn(userFactory, $scope)) {
         console.log("true:" + JSON.stringify(stateToTransition));
         stateGo($state, stateToTransition);
      }
      else {
         console.log("false");
         openLoginRegisterDialog(ngDialog, stateToTransition);
      }
      
   }; 
            
}])



/*************************************
* Reservations Controller
*************************************/
.controller(
   "ReservationsController", 
   ['$scope', '$stateParams', "userFactory", "timeslotFactory", "reservationFactory", "$state", 
   function($scope, $stateParams, userFactory, timeslotFactory, reservationFactory, $state) {
      
   console.log("minDate=", getCurrentDate());
   $scope.minDate = getCurrentDate();
      
   $scope.userFirstname = "Guest";
   $scope.isLoggedIn = false;
            
   // Protect the reservations page for authenticated users only
   var isValidated = validateUserOrReturn(userFactory, $scope, $state);
   if (!isValidated) return;

   console.log("stateParams=", $stateParams);
      
   $scope.restaurant = $stateParams.rid;
   $scope.restaurantName = $stateParams.name;
      
   $scope.login = function() {
      $scope.emit('login', '');
   };
      
   
   //----- 
   // For submit reservation request
   $scope.reservation = {date: "", 
                         nPeople: "", 
                         specialReq: "", 
                         status: "Reserved", 
                         timeslot: ""};
      
   //=====
   // Make A Reservation   
   $scope.hasMsg = false;
   $scope.infoMsg = "";
   $scope.reservationMsgType = "reservationSuccess";
   $scope.submitReservation = function() {
      
      console.log("reservation=" + JSON.stringify($scope.reservation));
      var resoPromise = reservationFactory.makeReservation($stateParams.rid)
                           .save($scope.reservation).$promise;
      
      resoPromise.then(function(res) {
         $scope.infoMsg = "Reservation Successful!";
         $scope.reservationMsgType = "reservationSuccess";
         $scope.hasMsg = true;
         disableAllControls();
                  
      }).catch(function(res){
         $scope.infoMsg = "Unable to reserve for this timeslot";
         $scope.reservationMsgType = "reservationFailed";
         $scope.hasMsg = true;
      });
   };
   //-----
      
      
   //=====
   // For fetching available timeslots
   $scope.availableTimeslots = [];   
   $scope.fetchAvailableTimeslots = function() {
      
      if (($scope.reservation.date == "") || 
          ($scope.reservation.nPeople == "")) {
         return;
      }
      
      //console.log("date="+$scope.reservation.date, 
        //          "nPeople="+$scope.reservation.nPeople, 
          //        "restaurant="+$scope.restaurant);
      
      var timeslotPromise = 
          timeslotFactory.findByNumOfPeople().query({rid: $stateParams.rid, 
                                                 nPeople: $scope.reservation.nPeople, 
                                                 date: $scope.reservation.date}).$promise;
      
      timeslotPromise.then(function(res) {
         
         //console.log("then="+ JSON.stringify(res));
         
         var currentTimeslot = 
             findTimeSlotFromCurrentDateTime($scope.reservation.date);
                  
         // filter out any timeslots that are already in the past.
         res = res.filter(function(timeslotObj) {
            return (timeslotObj.timeSlot >= currentTimeslot);
         });
         
         $scope.availableTimeslots = res;
         $scope.isTimeslotDropdownDisabled = false;
      })
      .catch(function(res) {
         
         console.log("catch");
         $scope.availableTimeslots = [];
         $scope.isTimeslotDropdownDisabled = true;
      });
      
   };
   //=====
   
   $scope.isTimeslotDropdownDisabled = true;
   
   $scope.isSubmitButtonDisabled = function() {
      
      return ($scope.isAllControlsDisabled || 
         !($scope.reservation.timeslot != "" && 
          $scope.reservation.date != "" && 
          $scope.reservation.nPeople != ""));
   }; 
      
      
   $scope.isAllControlsDisabled = false;
   function disableAllControls() {
      $scope.isAllControlsDisabled = true;
      $scope.isTimeslotDropdownDisabled = true;
   }
      
}])


/*************************************
* Ordering Controller
*************************************/
.controller(
   "OrderingController", 
   ['$scope', '$stateParams', "userFactory", "orderingFactory", "$state", "$location", "$anchorScroll", 
   function($scope, $stateParams, userFactory, orderingFactory, $state, $location, $anchorScroll) {

   var isValidated = validateUserOrReturn(userFactory, $scope, $state);
   if (!isValidated) return;
      
   $scope.restaurant = $stateParams.rid;
   $scope.restaurantName = $stateParams.name;
            
   $scope.currentCategory = "";
   
   // Get food categories
   $scope.foodCategories = 
      orderingFactory.getFoodCategories($scope.restaurant).query().$promise.then(
      function(res) {
         
         console.log(res);
         $scope.foodCategories = res;
         $scope.currentCategory = res[0].categoryName;
         
      }).catch(function(res) {
         
         console.error(res);
         $scope.foodCategories = [];
      });
      
   $scope.isCategorySelected = function(category) {
      
      return category == $scope.currentCategory;
   };
      
   // Get menu
   $scope.menu = 
      orderingFactory.getMenu($scope.restaurant).query().$promise.then(
      function(res) {
         
         console.log(res);
         $scope.menu = res;
         
      }).catch(function(res) {
      
         console.error(res);
         $scope.menu = [];
      });
      
   // Check to see if it's the same category
   var currCategory;
   $scope.checkSetIfDiffCategory = function(category) {

      var isDiff = currCategory != category;
      console.log("curr=", currCategory, "new=", category, "diff=", isDiff);
         
      currCategory = category;
      return isDiff;
   };
      
   // method to get around the jump to page section issue
   $scope.scrollTo = function(id) {
         $location.hash(id);
         $anchorScroll();
   };      

      
   // external basket for looping
   $scope.itemsAdded = [];
   $scope.itemsAddedSubTotal = 0;
   var TAX_PERCENT = 0.05;
   $scope.itemsAddedSubTotalTax = 0;
   $scope.itemsAddedGrandTotal = 0;
      
   // Update Tax and Grand Total after SubTotal is calculated.
   function updateTaxAndGrandTotal() {
      $scope.itemsAddedSubTotalTax = $scope.itemsAddedSubTotal * TAX_PERCENT;
      $scope.itemsAddedGrandTotal = $scope.itemsAddedSubTotal + $scope.itemsAddedSubTotalTax;      
   }
         
      
   // add remove counter to know whether basket is empty.
   var numItemsInBasket = 0;
   $scope.isBasketEmpty = function() {
      
      return (numItemsInBasket == 0);
   };      
      
   // calculate pickup time
   var INIT_PICKUP_TIME = 15;
   $scope.pickupTime = 0;   
   function calcPickupTime() {
      
      if (numItemsInBasket <= 5)
            $scope.pickupTime = INIT_PICKUP_TIME + (numItemsInBasket * 5);
      else if (numItemsInBasket <= 10)
            $scope.pickupTime = INIT_PICKUP_TIME + (numItemsInBasket * 7);
      else 
         $scope.pickupTime = INIT_PICKUP_TIME + (numItemsInBasket * 9);
   }         
      
   // Add item to basket (internal)
   var basket = {};
   $scope.addToBasket = function(menuItem, dishName, dishPrice) {
      
      if ($scope.isOrderDone) return;
      
      if (basket[menuItem] == undefined)
         basket[menuItem] = 1;
      else
         basket[menuItem] += 1;
      
      $scope.itemsAdded.push(
         {menuItem: menuItem, 
          dishName: dishName, 
          dishPrice: dishPrice, 
          added: true, 
          index: $scope.itemsAdded.length});
      
      // temporily persist the orders to localStorage to avoid data loss 
      // from page refresh.
      //console.log("addToBasket=" + angular.toJson($scope.itemsAdded));
      orderingFactory.storeOrdersObjects($scope.restaurant, basket, $scope.itemsAdded);
      
      numItemsInBasket++;
      calcPickupTime();
      
      $scope.itemsAddedSubTotal = $scope.itemsAddedSubTotal + parseFloat(dishPrice); 
      updateTaxAndGrandTotal();
      
      //console.log("basket=" + menuItem, dishName, basket[menuItem], dishPrice);
      //console.log("itemsAdded=" + JSON.stringify($scope.itemsAdded), 
      //            "total=", $scope.itemsAddedTotal.toFixed(2));
   };      
      
   // Remove item from basket
   $scope.removeFromBasket = function(menuItem, index) {
      
      if ($scope.isOrderDone) return;
      
      if (basket[menuItem] != undefined)
      {
         basket[menuItem] -= 1;
         
         // delete the parameter if it's empty
         if (basket[menuItem] == 0)
            delete basket[menuItem];
      }
      
      numItemsInBasket--;
      calcPickupTime();
      
      $scope.itemsAdded[index].added = false;
      
      // temporily persist the orders to localStorage to avoid data loss 
      // from page refresh.
      //console.log("removeFromBasket=" + angular.toJson($scope.itemsAdded));
      orderingFactory.storeOrdersObjects($scope.restaurant, basket, $scope.itemsAdded);
      
      $scope.itemsAddedSubTotal = 
         $scope.itemsAddedSubTotal - parseFloat($scope.itemsAdded[index].dishPrice);
      updateTaxAndGrandTotal();
      
      //console.log("itemsAdded=" + JSON.stringify($scope.itemsAdded), "total=", $scope.itemsAddedTotal.toFixed(2));
   };
         
   
   //=====
   // Quick method to handle load orders from storage
   // this method is used to handle reload the page.
   function loadOrdersFromStorage(orderingFactory) {
      
      basket = orderingFactory.getOrdersObjectForSubmission($scope.restaurant);
      $scope.itemsAdded = orderingFactory.getOrdersObjectForDisplay($scope.restaurant);
      
      
      
      for (var i=0; i < $scope.itemsAdded.length; i++) {
         if ($scope.itemsAdded[i].added) {
            $scope.itemsAddedSubTotal += parseFloat($scope.itemsAdded[i].dishPrice);
            numItemsInBasket++;
         }
               
         //console.log("itemsAddedSubTotal=", $scope.itemsAddedSubTotal);
      }
      
      calcPickupTime();
      updateTaxAndGrandTotal();
   }
   //=====
      
   
   //=====
   // Send the order
   $scope.order = {};
   $scope.isOrderDone = false;
   $scope.isOrderSuccessful = false;
   $scope.orderNow = function() {
      
      //var order = {};
      
      var menuItems = [];
      for (var key in basket) {
         menuItems.push({menuItem: key, numOfOrders: basket[key]});
      }
      
      $scope.order.menuItems = menuItems;
      $scope.order.restaurant = $scope.restaurant;
      
      console.log("orderNow", $scope.order);
      
      var orderPromise = orderingFactory.order($scope.restaurant).save($scope.order).$promise;
      orderPromise.then(function(res) {
         $scope.isOrderSuccessful = true;
         $scope.isOrderDone = true;
         console.log("order successful");
         orderingFactory.removeOrder($scope.restaurant);
      })
      .catch(function(res){
         $scope.isOrderSuccessful = false;
         $scope.isOrderDone = true;
         console.log("order failed");
      });
   };
   //=====
      
   // load up orders from Storage at startup.
   loadOrdersFromStorage(orderingFactory);
   
}])


/*************************************
* My Orders Controller
*************************************/
.controller(
   "MyOrdersController", 
   ['$scope', '$stateParams', "userFactory", "orderingFactory", "$state", "$location", "$anchorScroll", 
   function($scope, $stateParams, userFactory, orderingFactory, $state, $location, $anchorScroll) {

   var isValidated = validateUserOrReturn(userFactory, $scope, $state);
   if (!isValidated) return; 
      
   // Get My Orders
   $scope.myOrders = orderingFactory.getAllOrders().query().$promise
   .then(function(res) {
      console.log("myOrders=", res);
      $scope.myOrders = res;
   })
   .catch(function(res){
      console.log("No order found!");
      $scope.myOrders = [];
   });
      
      
   $scope.convertDateTime = convertDateTime;

   $scope.isRestaurantMgr = userFactory.isRestaurantMgr();
      

   // Get Order Statuses
   $scope.orderStatuses = orderingFactory.getAllOrderStatuses().query().$promise
   .then(function(res) {
      $scope.orderStatuses = res;
   })
   .catch(function(res){
      console.log("No order statuses found!");
      $scope.orderStatuses = [];
   });      
      
      
   $scope.setOrderStatus = function(orderId, orderStatus) {
      
      //console.log("orderId=", orderId, " orderStatus=",orderStatus);
      
      var newStatus = {orderStatus: orderStatus};
      
      // Get Order Statuses
      orderingFactory.updateOrderStatus(orderId).update(newStatus).$promise
      .then(function(res) {
         console.log("status updated successfully");
      })
      .catch(function(res){
         console.log("status NOT updated successfully");     
      });

   };
      
      
    
   
}])



/*************************************
* My Reservations Controller
*************************************/
.controller(
   "MyReservationsController", 
   ['$scope', '$stateParams', "userFactory", "reservationFactory", "$state", "$location", "$anchorScroll", 
   function($scope, $stateParams, userFactory, reservationFactory, $state, $location, $anchorScroll) {

   var isValidated = validateUserOrReturn(userFactory, $scope, $state);
   if (!isValidated) return;
   
      
   // Get My Reservations
   $scope.myReservations = reservationFactory.getAllReservations().query().$promise
   .then(function(res) {
      $scope.myReservations = res;
      console.log("myRes=", res);
   })
   .catch(function(res){
      console.log("No reservation found!");
      $scope.myReservations = [];
   });
      
      
   $scope.convertDateTime = convertDateTime;

   $scope.isRestaurantMgr = userFactory.isRestaurantMgr();
      

   // Get Order Statuses
   $scope.reservationStatuses = reservationFactory.getAllReservationStatuses().query().$promise
   .then(function(res) {
      $scope.reservationStatuses = res;
   })
   .catch(function(res){
      console.log("No order statuses found!");
      $scope.reservationStatuses = [];
   });      
      
      
   $scope.setReservationStatus = function(rsId, reservationStatus) {
      
      //console.log("rsId=", rsId, " reservationStatus=",reservationStatus);
      
      var newStatus = {reservationStatus: reservationStatus};
      
      // Get Order Statuses
      reservationFactory.updateReservationStatus(rsId).update(newStatus).$promise
      .then(function(res) {
         console.log("status updated successfully");
      })
      .catch(function(res){
         console.log("status NOT updated successfully");     
      });

   };
      
      
    
   
}])



/*************************************
* Users Controller
*************************************/
.controller(
   "UsersController", 
   ['$rootScope', '$scope', 'ngDialog', "userFactory", "$state",
   function($rootScope, $scope, ngDialog, userFactory, $state) {

   //$scope.isLoggedIn = false;
   $scope.userFirstname = "Guest";
   $scope.isLoggedIn = false;
            
   checkIsLoggedIn(userFactory, $scope);
    

   $scope.openLogin = function() {
        openLoginRegisterDialog(ngDialog);
   };      
   
   /*
   $scope.openRegister = function() {
        openRegisterDialog(ngDialog);
   };
   */
      
   //=====
   // Handle Login / Register tab change
   // default is the login tab
   var currentTab = "login";
   $scope.setTab = function(tab) {
      //console.log("set tab=" + tab);
      currentTab = tab;
   };
      
   $scope.isTabSet = function(tab) {
      //console.log("is tab set=" + tab);
      return (currentTab == tab);
   };
   //=====
      
   // login model binding   
   $scope.loginData = {username: "", password: ""};
   $scope.rememberMe = "";
   $scope.invalidLogin = false;
   
      
   // register model binding
   $scope.registration = {username: "", password: "", firstname: "", lastname: ""};
   $scope.invalidRegistration = false;
      
   // Register.  If successful, it will trigger an auto login.
   $scope.register = function() {
      
      var regPromise = userFactory.register().save($scope.registration).$promise;
      
      regPromise.then(function(res){
      
         // if registration is successful, then we automatically login
         // the user.
         console.log("registration successful: " + $scope.registration.username, $scope.$parent.ngDialogData);
         $scope.loginData.username = $scope.registration.username;
         $scope.loginData.password = $scope.registration.password;
         $scope.login();
         
      })
      .catch(function(res){
         console.log("registration failed: " + $scope.registration.username);
         $scope.invalidRegistration = true;
      }); 
   };
      
   
   // Login
   $scope.login = function() {
     var loginPromise = userFactory.login().save($scope.loginData).$promise;
      
     loginPromise.then(function(res) {
        console.log("success=", res);
        $scope.invalidLogin = false;
        userFactory.storeUserCredentials({username: $scope.loginData,
                                         token: res.token,
                                         userFirstname: res.firstname,
                                         restaurantMgr: res.restaurantMgr});
        
        $rootScope.$broadcast("login:Successful", {userFirstname: res.firstname});
        ngDialog.close();
        
        // if login successful, we will follow the state transition if available.
        if ($scope.$parent.ngDialogData)
            stateGo($state, $scope.$parent.ngDialogData);
     })
     .catch(function(res) {
        console.log("failed");
        $scope.invalidLogin = true;
     });
   };
      
   
   // Logout
   $scope.logout = function() {
      userFactory.logout();
      $scope.userFirstname = "Guest";
      $scope.isLoggedIn = false;
      
      // If the page needs login privilage, logging out will
      // redirect the page to the main page.
      if ($state.current.data && $state.current.data.needLogin) {
         validateUserOrReturn(userFactory, $scope, $state);
      }
   };
      
   // Subscriber on successful login.
   $rootScope.$on('login:Successful', function(event, data) {
      console.log("received emit" + JSON.stringify(data));    
      $scope.userFirstname = data.userFirstname;
      $scope.isLoggedIn = true;
      
   });
      
}])


;


// Protect the my orders page for authenticated users only
function validateUserOrReturn(userFactory, $scope, $state) {
   
   console.log("state=", $state);
   
   var isLoggedIn = checkIsLoggedIn(userFactory, $scope);

   if (!isLoggedIn) {
      stateGo($state, {state: "app"})
   }
   
   return isLoggedIn;
}


function stateGo($state, stateParam) {
      
   if (stateParam == null) {
      console.log("stateGo, no param");
      $state.go(stateParam.state);
   }
   else {
      console.log("stateGo, with param = ", stateParam.param);
      $state.go(stateParam.state, stateParam.param);
   }
}



function getCurrentDate() {
   var today = new Date();
   var dd = today.getDate();
   var mm = today.getMonth() + 1;
   var yyyy = today.getFullYear();
   
   if (dd < 10) {
      dd='0'+dd;
   } 

   if(mm < 10) {
      mm='0'+mm;
   }
   
   today = mm+ '/' + dd + '/' + yyyy;
   return today;
}




/********************
* Convert DateTime
*********************/
function convertDateTime(dateStr) {
      
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      var dateObj = new Date(dateStr);
      
      var hours = dateObj.getHours();
      //it is pm if hours from 12 onwards
      var suffix = (hours >= 12)? 'pm' : 'am';

      //only -12 from hours if it is greater than 12 (if not back at mid night)
      hours = (hours > 12)? hours -12 : hours;

      //if 00 then it is 12 am
      hours = (hours == '00')? 12 : hours;

      var min = dateObj.getMinutes();
      if (min < 10) 
         min = "0" + min;
      
      var year = dateObj.getFullYear();
      var month = months[dateObj.getMonth()];
      var date = dateObj.getDate();
      
      return month + " " + date + ", " + year + " " + hours + ":" + min + suffix;
}


function openLoginRegisterDialog(ngDialog, stateData) {
   ngDialog.open({ template: 'views/loginRegister.html', className: 'ngdialog-theme-default', data: stateData });
}

/*
function openRegisterDialog(ngDialog, stateData) {
   ngDialog.open({ template: 'views/register.html', className: 'ngdialog-theme-default', data: stateData });
}
*/

function checkIsLoggedIn(userFactory, $scope) {
   
   if (userFactory.isAuthenticated()) {
      console.log("user authenticated");
      $scope.isLoggedIn = true;
      $scope.userFirstname = userFactory.getUserFirstname();
      //$rootScope.$broadcast("login:Successful", {userFirstname: $scope.userFirstname});
      return true;
   }      
   else {
      console.log("user NOT authenticated");
      return false;
   }
}



function getCostIndicator(low, high) {
      
   if (low <=15 && high <= 50)
      return "$";
   
   if (high <= 50)
      return "$$";
   
   if (high > 50)
      return "$$$";
   
}


//=====
// Find Timeslot which the current Datetime is in.
function findTimeSlotFromCurrentDateTime(targetDate) {
   
   var currentDateTime = new Date();
   var dateStr = 
       currentDateTime.getMonth() + 1 + "/" + 
       currentDateTime.getDate() + "/" + 
       currentDateTime.getFullYear();
   
   //console.log("DateTime=", currentHours, currentMins);
   
   // if the timeslot being acquired isn't today,
   // we return the first timeslot of the day, which is 1
   if (targetDate !== dateStr)
      return 1;
   
   // else, we have to calculate
   var currentHours = currentDateTime.getHours();
   var currentMins = currentDateTime.getMinutes();
   
   var timeslot = (currentHours * 2) + 1;
   if (currentMins >= 30)
      timeslot += 1;
      
   return timeslot;
}


