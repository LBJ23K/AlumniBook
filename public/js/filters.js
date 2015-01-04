'use strict';

/* Filters */

angular.module('myApp.filters', ['ngRoute']).
  filter('userFilter', function () {
  	return function(items,search) {
  		console.log(search)
  	};
  });
