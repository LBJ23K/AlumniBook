'use strict';

/* Directives */

angular.module('myApp.directives', ['ngRoute']).
  directive('test', function (version) {
    return function(scope, element, attrs) {
    	console.log(attrs)
    };
  });
