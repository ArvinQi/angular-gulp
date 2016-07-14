'use strict';


require.config({
    //配置angular的路径
    paths: {
        // css
        "appcss": "/_assets/styles/css/app",
        // js
        "angular": "/bower_components/angular/angular",
        "angular-route": "/bower_components/angular-route/angular-route",
        'myController': '/modules/controller',
        'myRouter': '/modules/router',
        'myDirective': '/modules/directive',
        'myService': '/modules/service'
    },
    //这个配置是你在引入依赖的时候的包名
    shim: {
        "angular": {
            exports: "angular"
        },
        "angular-route": {
            deps: ['angular'],
            exports: "angular-route"
        }
    },
    map: {
        '*': {
            'css': 'bower_components/require-css/css' // or whatever the path to require-css is
        }
    }
});
define(['css!appcss', 'angular', 'myController', 'myRouter', 'myDirective', 'myService'], function () {
    var moduleName = 'app';
    var module;
    module = angular.module(moduleName, ['myController', 'myRouter', 'myDirective', 'myService']);
});
