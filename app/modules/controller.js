'use strict';
define(['angular'], function(angular){
    var moduleName = 'myController';
    var module;

    module = angular.module(moduleName, []);

    module
        .controller('index', ['$scope', '$location', index])
        .controller('error', ['$scope', '$location', error])
        ;

    function index($scope, $location) {
    }
    function error($scope, $location) {
        console.error('404');
    }
});


