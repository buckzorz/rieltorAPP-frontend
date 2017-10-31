'use strict';

angular.module('rieltorApplication')

.controller('headerController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', '$localStorage', function ($scope, $state, $rootScope, ngDialog, AuthFactory, $localStorage){
        $scope.IS_RIELTOR = 'rieltor';
        $scope.isRieltor = false;
        $scope.loggedIn = false;
        $scope.username = '';
    
        if(AuthFactory.isAuthenticated()) {
            if($localStorage.getObject($scope.IS_RIELTOR, false)){
                $scope.isRieltor = true;
                console.log('Rieltor');
            } else {
                $scope.isRieltor = false;
                console.log('Client');
            }
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
        }
        $scope.openLogin = function () {
                ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController"});
            };
    
        $scope.logOut = function() {
           AuthFactory.logout();
            $scope.loggedIn = false;
            $scope.username = '';
        };

        $rootScope.$on('login:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $rootScope.$on('registration:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        $scope.stateis = function(curstate) {
           return $state.is(curstate);  
        };
        
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])

.controller('homeController', ['$scope', function($scope){
    
}])

.controller('apartmentsController', ['$scope','ngDialog', 'apartmentsFactory', '$rootScope', 'AuthFactory', function($scope, ngDialog, apartmentsFactory, $rootScope, AuthFactory){
       
    $scope.isRieltor = AuthFactory.isRieltor();
     
    //code for the filters button
    $scope.navopen= false;
    $scope.navtracker = function () {
         if($scope.navopen === false)
             $scope.navopen = true;
         else
             $scope.navopen = false;
     }
    //don't forget to add controllers 
    $scope.addapartment = function () {
            ngDialog.open({ template: 'views/addapartment.html', scope: $scope, className: 'ngdialog-theme-default', controller:"AddApartmentController"});
        };
    //gets app apartments in the data base and sets the view depending on responce 
    $scope.showMenu = false;
    apartmentsFactory.query(
        function (response) {
            $scope.apartments = response;
            $scope.showMenu = true;
            /*console.log($scope.apartments[0].image[0].base64);*/

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    
    $scope.filter = {};
    $scope.filterApartments = function() {
        console.log($scope.filter);
        //code for fetching an appartment based on filter
        apartmentsFactory.query($scope.filter).$promise.then(
            function (response) {
                $scope.apartments = response;
            },
            function (responce) {
                $scope.message = "Error: " + responce.status + " " + responce.statusText;
            }
        );
    };
        

}])

.controller('clientsController', ['$scope', 'ngDialog', 'clientFactory','$rootScope', 'AuthFactory', function($scope, ngDialog, clientFactory, $rootScope, AuthFactory){
    
 $scope.isRieltor = AuthFactory.isRieltor();
    
    //don't forget to add controllers 
    $scope.addclient = function () {
            ngDialog.open({ template: 'views/addclient.html', scope: $scope, className: 'ngdialog-theme-default', controller: 'AddClientController'});
        };
    
    
    
    $scope.showMenu = false;
    clientFactory.query(
        function (response) {
            $scope.clients = response;
            $scope.showMenu = true;

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
        
}])

.controller('apartmentDetailController', ['$scope','$state', '$stateParams','ngDialog','apartmentsFactory','favoritesFactory','$rootScope', 'AuthFactory', function($scope, $state, $stateParams, ngDialog, apartmentsFactory, favoritesFactory, $rootScope, AuthFactory){
    
 $scope.isRieltor = AuthFactory.isRieltor();
    
    $scope.editapartment = function () {
            ngDialog.open({ template: 'views/editapartment.html', scope: $scope, className: 'ngdialog-theme-default', controller:"EditApartmentController"});
        };
    
    $scope.addFavorite = function() {
        favoritesFactory.save({_id: $stateParams.id}).$promise.then(
        function(responce){
            console.log(responce);
        },
        function(responce){
            console.log(responce);
        }    
        );
        console.log('Add to favorites', $stateParams.id);
    };
    
    
    $scope.apartment = {};
    //change when testing
    $scope.showApartment = true;
    $scope.message = "Loading...";
    
    $scope.deleteApartment = function() {
        apartmentsFactory.delete({_id: $stateParams.id})
        console.log('Deleted favorite', $stateParams.id);
    }
    
    $scope.apartment = apartmentsFactory.get({
        id: $stateParams.id
    })
    .$promise.then(
    function(response){
        $scope.apartment = response;
        $scope.showApartment = true;
        $rootScope.$broadcast('apartmentStatus:loaded');
        console.log($scope.apartment[0]);
    },
    function(response){
        $scope.message = "Error: " + response.status + " " + response.statusText;
    });
    
    //when the apartment is loaded this part is executed to load apartments in the same district
    $scope.suggestedApartments = {};
    $rootScope.$on('apartmentStatus:loaded', function () {
        //code for fetching an appartment based on filter
        $scope.filter = {district: $scope.apartment.district, rooms: $scope.apartment.rooms};
        apartmentsFactory.query($scope.filter).$promise.then(
            function (response) {
                $scope.suggestedApartments = response;
                console.log($scope.suggestedApartments);
            },
            function (responce) {
                $scope.message = "Error: " + responce.status + " " + responce.statusText;
            }
        );
        });
    
}])

.controller('clientDetailController', ['$scope','$state', '$stateParams', 'favoritesFactory', function($scope, $state, $stateParams, favoritesFactory){
    $scope.client = {};
    //change when testing
    $scope.showClient = true;
    $scope.message = "Loading...";
    //call to the factory to fetch the client
        favoritesFactory.query({id:$stateParams.id},
        function (response) {
            $scope.client = response;
            console.log(response);
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    
    console.log($stateParams.id); 
}])

.controller('AddApartmentController', ['$scope', 'apartmentsFactory', '$state', '$stateParams', function($scope, apartmentsFactory, $state, $stateParams){
    
    $scope.newApartment = {};
    
    $scope.addapartment = function () {
        console.log($scope.newApartment);   
        apartmentsFactory.save($scope.newApartment);
        ngDialog.close();
    };
       
}])

.controller('EditApartmentController', ['$scope','$state', '$stateParams','apartmentsFactory', function($scope, $state, $stateParams, apartmentsFactory){
    
    $scope.apartment = apartmentsFactory.get({
        id: $stateParams.id
    })
    .$promise.then(
    function(response){
        $scope.apartment = response;
        $scope.showApartment = true;
    },
    function(response){
        $scope.message = "Error: " + response.status + " " + response.statusText;
    });
    
    
    $scope.submitapartment = function () {
        apartmentsFactory.$update($scope.apartment);
        console.log($scope.apartment);    
    };
    
}])

.controller('AddClientController', ['$scope', function($scope){
    //perhabs add favorites at this statge if mongo doesnt add it automaticly
    $scope.newClient = {}
    
    //addapartment function, when triggered should add a new client entry in clients collection based on newClient json object
    $scope.addclient = function () {
        console.log($scope.newClient);    
    };
       
}])

;