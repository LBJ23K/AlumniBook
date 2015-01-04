'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  // 'ngRoute',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ui.router'

])
.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
  
  $stateProvider.
    state('index', {
      url:'/',
      templateUrl: 'partial/home',
      controller: 'Home'
    }).
    state('signup', {
      url:'/signup',
      templateUrl: 'partial/signup',
      controller: 'Signup'
    }).
    // state('login', {
    //   url:'/login',
    //   // templateUrl: 'partial/login',
    //   controller: 'Login'
    // }).
    state('logout', {
      url:'/logout',
      controller: 'Logout'
    }).
    state('post', {
      url:'/post',
      templateUrl: 'partial/post',
      controller: 'Post'
    }).
    state('topic', {
      url:'/topic/:id',
      templateUrl: 'partial/topic',
      controller: 'Topic'
    }).state('otherwise',{
      url: "/"
    }).
    state('usersetting', {
      url:'/usersetting',
      templateUrl: 'partial/usersetting',
      controller: 'Usersetting'
    })
    .
    state('userlist', {
      url:'/userlist',
      templateUrl: 'partial/userlist',
      controller: 'Userlist'
    })

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
}]);
