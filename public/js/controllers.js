'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngRoute']).
  controller('AppCtrl', function ($rootScope, $window, $scope, $http, $state) {
    $rootScope.isLogin = $window.isLogin;
    if (typeof(Storage) != "undefined") {
      var lang = localStorage.getItem("lang");
      console.log(lang);
      if( lang!=null) $rootScope.lang = lang;
      else{
        $rootScope.lang = "zh-TW";
      } 
    } 
    else {
      alert("Sorry, your browser does not support Web Storage...");
    }
    $rootScope.user = {
      name: $window.userName,
      gender: $window.gender,
      school: $window.userSchool,
      department: $window.userDepartment,
      grade: $window.userGrade,
      photo: $window.userPhoto
    }

    console.log($rootScope.lang)
    $rootScope.$watch('lang',function(newValue, oldValue){   

      if(newValue!=oldValue){
        localStorage.setItem("lang", newValue);
        $http({method:"POST", url:'/api/setLocale', data:{locale:newValue}}).success(function(result){
          // $state.transitionTo('index', null, {'reload':true});
          location.reload();
      });

      }
      
    })
 
  }).
  controller('Home', function ($rootScope, $scope, $location, $http) {
    // write Ctrl here
    $http({method:"GET", url:'/issue/list'}).success(function(posts){
      $scope.posts = _.sortBy(posts, function(post){
        console.log(moment(post.createdAt).format('MMMM Do YYYY, h:mm:ss a'))
        return -(new Date(post.createdAt).getTime())});
      console.log(posts);
    })
    $scope.time = function (t) {
      return moment(t).format('MMMM Do YYYY, h:mm:ss a')
    }
    $scope.newPost = function(){
      if(!$rootScope.isLogin){
        alertify.alert("Please login.", function (e) {
            if (e) {
                // user clicked "ok"
                $location.path('/login');
                $scope.$apply();
                
            }
        });
        
      }else{
        $location.path('/post')
      }
      
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
      $http({method:"POST", url:"/issue/create", data:data}).success(function(post){
        console.log(post);
        $location.path('/topic/'+post.issue_id);
      });
    }

  }).
  controller('Topic', function ($scope, $state, $http, $route, $location) {
    // write Ctrl here
    $scope.myComment = "";
    console.log($state.params.id)
    $http({method:"GET", url:'/issue/listById?issue_id='+$state.params.id}).success(function(result){
      $scope.post = result.post;
      $scope.comments = result.comments;
      $scope.likeThis = result.likeThis;
      $scope.like = result.like;
      $scope.isAuthor = result.isAuthor;
      console.log(result);
    })
    $scope.deleteIssue = function(){
      $http({method:"GET", url:'/issue/destroy?issue_id='+$state.params.id}).success(function(result){
        console.log(result);
        $location.path('/')
      })
    }
    $scope.likePost = function(){
      $http({method:"GET", url:'/api/like/'+$state.params.id}).success(function(result){
        console.log(result);
        if(result.msg == "success"){
          $scope.likeThis = !$scope.likeThis;
          $scope.like+=1;
        }
      })
    }
    $scope.dislikePost = function(){
      $http({method:"GET", url:'/api/dislike/'+$state.params.id}).success(function(result){
        console.log(result);
        if(result.msg == "success"){
          $scope.likeThis = !$scope.likeThis;
          $scope.like-=1;
        }
      })
    }
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
          console.log(post);
          if(post.msg!="success"){ 
            alert(post.msg);
          }
          // console.log("success");
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
            console.log(post);
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
  }).
  controller('Usersetting', function($scope, $location, $state,$http){
    $scope.edit = false;
    var expLen;
    $scope.init = function(){
      $http({
        method:"GET",
        url:"/api/user"
      })
      .success(function(data){
        $scope.user = data;
        $scope.editdata = angular.copy(data);
        expLen = data.Experiences.length;
        // console.log($scope.user)
      })
      .error(function(){
        console.log('fail');
      })
    }
    $scope.addnewExp = function(){
      $scope.editdata.Experiences.push({})
    }
    $scope.modifysubmit = function(){
      var modify = angular.copy($scope.editdata);
      // modify.Education = JSON.stringify(modify.Education);
      // modify.Experience = JSON.stringify(modify.Experience);
      // modify.Contact = JSON.stringify(modify.Contact); 
      modify.expLen = expLen;
      console.log(modify)
      // return
      $http({
        method:"POST",
        url:"/api/user/modify",
        data:modify
      })
      .success(function(data){
        console.log(data);
        if(!data.msg) {
          alertify.alert(data.type+" error.", function (e) {
                window.location.reload();
          });
        }
        else window.location.reload();
      })
      .error(function(){
        console.log('fail');
      })
    }
  });
