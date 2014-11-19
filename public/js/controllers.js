'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngRoute']).
  controller('AppCtrl', function ($rootScope, $window, $scope, $http) {
    $rootScope.isLogin = $window.isLogin;
    
    $rootScope.user = {
      name: $window.userName,
      gender: $window.gender,
      school: $window.userSchool,
      department: $window.userDepartment,
      grade: $window.userGrade,
      photo: $window.userPhoto
    }
  }).
  controller('Home', function ($scope, $location, $http) {
    // write Ctrl here
    $http({method:"GET", url:'/api/posts'}).success(function(posts){
      $scope.posts = _.sortBy(posts, function(post){
        console.log(moment(post.createdAt).format('MMMM Do YYYY, h:mm:ss a'))
        return -(new Date(post.createdAt).getTime())});
      console.log(posts);
    })
    $scope.time = function (t) {
      return moment(t).format('MMMM Do YYYY, h:mm:ss a')
    }
    $scope.newPost = function(){
      $location.path('/post')
    }
    $scope.select = function(id){
      $location.path('/topic/'+id);
    }
  }).
  controller('Post', function ($scope, $http, $location) {
    $scope.title = "";
    $scope.content = "";
    // console.log(userSchool);
    // write Ctrl here
    $scope.submitPost = function(){
      var data = {
        title: $scope.title, 
        content: $scope.content
      }
      $http({method:"POST", url:"/api/submitPost", data:data}).success(function(post){
        console.log(post);
        $location.path('/topic/'+post.post_id);
      });
    }

  }).
  controller('Topic', function ($scope, $state, $http, $route, $location) {
    // write Ctrl here
    $scope.myComment = "";
    console.log($state.params.id)
    $http({method:"GET", url:'/api/post/'+$state.params.id}).success(function(result){
      $scope.post = result.post;
      $scope.comments = result.comments;
      // console.log(post);
    })
    $scope.submitComment = function(){
      var data = {
        post_id : $state.params.id,
        content : $scope.myComment 
      }
      $http({method:"POST", url:'/api/comment/', data:data}).success(function(result){
        $state.go($state.$current, null, { reload: true });
      });
    }
    $scope.time = function (t) {
      return moment(t).format('MMMM Do YYYY, h:mm:ss a')
    }
  }).
  controller('Login', function ($scope, $http, $location, $state) {
    // write Ctrl here
    $scope.account = "";
    $scope.password = "";
    $scope.Login = function(){
      var data = {
        account:$scope.account,
        password:$scope.password
      }
      $http({method:"POST", url:"/api/login", data:data}).success(function(post){
          console.log("success");
          window.location.reload();
          $location.path('/')
        });
    }

  }).
  controller('Signup', function ($scope, $http, $location, $state) {
    // write Ctrl here
    $scope.photo = "";
    console.log('h')
    $scope.upload = function(){
    
    filepicker.setKey('AFCDnLjVTqKLe4YmXaifgz');
    filepicker.pickAndStore({},{location:"S3",container:"dcard-guang"},function(InkBlob){
      console.log(InkBlob);
      $scope.photo = "https://dcard-guang.s3.amazonaws.com/" + InkBlob[0].key;;
      $scope.$apply();
      // alert("success");
    });  
  }
    $scope.signup = function(){
      var data = {
        name: $scope.name,
        school: $scope.school,
        gender: $scope.gender,
        department: $scope.department,
        grade: $scope.grade,
        photo: $scope.photo,
        account: $scope.account,
        password: $scope.password
      }
      $http({method:"POST", url:'/api/signup', data:data}).success(function(result){
        var data = {
        account:$scope.account,
        password:$scope.password
        }
        $http({method:"POST", url:"/api/login", data:data}).success(function(post){
            console.log("success");
            window.location.reload();
            $location.path('/')
        });
      })
    }

  }).
  controller('Logout', function($scope, $location, $state){
    // $rootScope.isLogin = false;
    // $rootScope.user = {};
    window.location.reload();
  });
