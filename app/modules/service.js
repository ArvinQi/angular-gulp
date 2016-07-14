'use strict';
define(['angular'], function(angular){
    var moduleName = 'myService';
    var module;

    module = angular.module(moduleName, []);
    module.factory('userListService', ['$http', userListService]);

    function userListService($http) {
        var doRequest = function (email) {
            return $http({
                method: 'POST',
                contentType: "text/json",
                dataType: "json",
                data: { email: email },
                url: ''
            });
        }
        return {
            userList: function (email) {
                return doRequest(email, 'userList');
            }
        };
    }

});
