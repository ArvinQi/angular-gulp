'use strict';
define(['angular', 'angular-route'], function (angular) {
    // require(['angular-route'], function () {
        var moduleName = 'myRouter';
        var module;
        module = angular.module(moduleName, ['ngRoute']);
        module.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            // $locationProvider.html5Mode({
            //     enabled: true,
            //     requireBase: false
            // });
            // $locationProvider.hashPrefix = '!';
            // $routeProvider.hash('!');
            var rootPath = '/';
            $routeProvider
                .when(rootPath, {
                    templateUrl: rootPath + 'pages/index.html',
                    controller: 'index'
                })
                .when(rootPath + 'index', {
                    templateUrl: rootPath + 'pages/index.html',
                    controller: 'index'
                })
                .otherwise({
                    templateUrl: rootPath + 'pages/404.html',
                    controller: 'error'
                });
        }]);

    // });
});
