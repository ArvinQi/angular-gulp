'use strict';
define(['angular'], function(angular){
    var moduleName = 'myDirective';
    var module;

    module = angular.module(moduleName, []);
    var rootPath = '';
    module
        .directive('ngFocus', [ngFocus])
        .directive('load', [load])
        ;

    function ngFocus() {
        var FOCUS_CLASS = "ng-focused";
        var BLUR_CLASS = "ng-blur";
        var WRONG = "wrong";
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$focused = true;
                element.bind('focus', function (evt) {
                    element.next('.error').addClass('hide').removeClass('show');
                    element.addClass(FOCUS_CLASS);
                    element.removeClass(BLUR_CLASS);
                    scope.$apply(function () {
                        ctrl.$focused = true;
                    });
                }).bind('blur', function (evt) {
                    element.next('.error').addClass('show').removeClass('hide');
                    element.removeClass(FOCUS_CLASS);
                    element.removeClass(WRONG);
                    element.addClass(BLUR_CLASS);
                    scope.$apply(function () {
                        ctrl.$focused = false;
                    });
                });
            }
        }
    }

    function load() {
        return {
            restrict: 'EA',
            require: ['?ngModel'],
            link: function (scope, elements, attrs, ngModels) {
                elements.addClass('opacity');
                scope.$watch(attrs.load, function (value) {
                    if (value != null) {
                        setTimeout(function() {
                            elements.removeClass('opacity');                            
                        }, 100);
                        // $(elements).removeClass("hidden").removeAttr("style");
                        // $(elements).removeClass("hidden").slideDown("slow").removeAttr("style");
                    }
                }, true);
            }
        }
    }

    

});