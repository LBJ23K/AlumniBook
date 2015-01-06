'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  // 'ngRoute',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'highcharts-ng',
  'ui.router',
])
.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
  
  $stateProvider.
    state('index', {
      url:'/',
      templateUrl: 'partial/home',
      controller: 'Home'
    }).
    state('account', {
      url:'/accountsetting',
      templateUrl: 'partial/account',
      controller: 'Account'
    }).
    state('login', {
      url:'/login',
      templateUrl: 'partial/login',
      controller: 'Login'
    }).
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
    }).
    state('usersetting', {
      url:'/usersetting',
      templateUrl: 'partial/usersetting',
      controller: 'Usersetting'
    }).
    state('userList', {
      url:'/users/userlist',
      templateUrl: 'partial/userList',
      controller: 'UserList'
    }).
    state('userprofile', {
      url:'/users/:id',
      templateUrl: 'partial/usersetting',
      controller: 'Profile'
    }).
    state('chart',{
      url:'/chart',
      templateUrl: 'partial/chart',
      controller: 'Chart'
     }).
    state('search',{
      url:'/search/:category/:field/:searchtext',
      templateUrl: 'partial/searchresult',
      controller: 'Search'
     }).
    state('otherwise',{
      url: "/"
    })

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
}]);


