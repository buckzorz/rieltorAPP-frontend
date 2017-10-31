'use strict';
 angular.module('rieltorApplication', ['naif.base64', 'ui.router', 'ngResource', 'ngDialog'])
 .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouteProvider){
    $stateProvider
        .state('app', {
            url:'/',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller : 'headerController'
                },
                'content': {
                    templateUrl: 'views/home.html',
                    controller: 'homeController'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            }
        })
        .state('app.apartments', {
            url: 'apartments',
            views:{
                'content@': {
                    templateUrl: 'views/apartments.html',
                    controller: 'apartmentsController'
                }
            }
        
        })
        .state('app.clients', {
            url: 'clients',
            views:{
                'content@': {
                    templateUrl: 'views/clients.html',
                    controller: 'clientsController'
                }
            }
        })
        .state('app.apartmentDetail', {
            url: 'apartments/:id',
            views:{
                'content@': {
                    templateUrl: 'views/apartmentdetail.html',
                    controller: 'apartmentDetailController'
                }
            }
        })
        .state('app.clientDetail', {
            url: 'clients/:id',
            views: {
                'content@': {
                    templateUrl: 'views/clientdetail.html',
                    controller: 'clientDetailController'
                }
            }
        });
        
        $urlRouteProvider.otherwise('/')
 }]);