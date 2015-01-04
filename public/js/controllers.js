'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngRoute']).
  controller('AppCtrl', function ($rootScope, $window, $scope, $http, $state, $location) {
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
      user_id: $window.userId,
      gender: $window.gender,
      school: $window.userSchool,
      department: $window.userDepartment,
      grade: $window.userGrade,
      photo: $window.userPhoto,
      notifications: $window.notifications
    };

    console.log($rootScope.lang);
    $rootScope.$watch('lang',function(newValue, oldValue){   

      if(newValue!=oldValue){
        localStorage.setItem("lang", newValue);
        $http({method:"POST", url:'/api/setLocale', data:{locale:newValue}}).success(function(result){
          // $state.transitionTo('index', null, {'reload':true});
          location.reload();
        });
      }
    });
    $rootScope.host = window.location.host;

    $scope.searchFields = [];
    $http.get('/issue/searchFields').success(function(fields) {
      $scope.searchFields = fields;
      $scope.searchingField = fields[0];
    });

    $scope.setSearchField = function(field) {
      $scope.searchingField = field;
    };

    $scope.search = function(text) {
      if (!text || text == '') {
        $rootScope.searchResults = null;
        $rootScope.$broadcast('searchDone');
        return;
      }

      var query = {
        field: $scope.searchingField.field,
        searchText: text
      };
      $http.post('/issue/search', query).success(function(issues){
        $rootScope.searchResults = _.sortBy(issues, function(post) {
          return -(new Date(post.createdAt).getTime());
        });

        var currentPath = $location.path();
        if (currentPath != '/') {
          $location.path('/');
        }
        $rootScope.$broadcast('searchDone');
      });
    };

    $scope.get_notifications = function(){
        $http({method: "GET", url: "/notify/get_notifications"}).success(function(result){
            $scope.notifications = result;         
        });
    };
    $scope.select = function(id){
      $location.path('/topic/'+id);
      $http({method: "GET", url: "/notify/get_notifications"}).success(function(result){
          $scope.notifications = result;         
      });      
    };

  }).
  controller('Home', function ($rootScope, $scope, $location, $http) {
    // write Ctrl here
    $scope.posts = [];
    $http({method:"GET", url:'/issue/list'}).success(function(posts){
      $scope.allPosts = _.sortBy(posts, function(post){
        console.log(moment(post.createdAt).format('MMMM Do YYYY, h:mm:ss a'))
        return -(new Date(post.createdAt).getTime())});
      console.log(posts);

      if ($rootScope.searchResults) $scope.posts = $rootScope.searchResults;
      else $scope.posts = $scope.allPosts;
    });

    $scope.$on('searchDone', function() {
      if ($rootScope.searchResults) $scope.posts = $rootScope.searchResults;
      else $scope.posts = $scope.allPosts;
    });

    $scope.time = function (t) {
      return moment(t).format('MMMM Do YYYY, h:mm:ss a')
    };
    $scope.newPost = function(){
      if(!$rootScope.isLogin){
        // alertify.alert("Please login.", function (e) {
        //     if (e) {
        //         // user clicked "ok"
        //         $location.path('/login');
        //         $scope.$apply();
                
        //     }
        // });

        $('.ui.login.modal')
        .modal({
          closable  : true,
          onApprove : function() {
            $location.path('/login');
            $scope.$apply();
          }
        })
        .modal('show');
        
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
    $scope.cat_id = 1;
    $http({method:"GET", url:'/category/list'}).success(function(category){
      $scope.category = category;
    })
    // console.log(userSchool);
    // write Ctrl here
    $scope.submitPost = function(){
      var data = {
        title: $scope.title, 
        content: $scope.content,
        postCategory_id:$scope.cat_id
      }
      $http({method:"POST", url:"/issue/create", data:data}).success(function(post){
        console.log(post);
        $location.path('/topic/'+post.issue_id);
      });
    }

  }).
  controller('Topic', function ($rootScope, $scope, $state, $http, $route, $location, $window) {
    // write Ctrl here
    $scope.myComment = "";
    // $scope.SubscribeThis = true;
    // console.log($state.params.id)
    $http({method:"GET", url:'/issue/listById?issue_id='+$state.params.id}).success(function(result){
      $scope.post = result.post;
      $scope.comments = result.comments;
      $scope.likeThis = result.likeThis;
      $scope.like = result.like;
      $scope.isAuthor = result.isAuthor;
      $scope.SubscribeThis = result.isSubscribe;
      $rootScope.user.notifications -= result.reads;
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
    $scope.subscribePost = function(){
      if($window.isLogin == true){

      $scope.SubscribeThis = true;
      $http({method:"GET", url:'/notify/subscribe/'+$state.params.id}).success(function(result){
        console.log(result);
      })
      }
      else{
        alert("Please login first!");
      }
    }
    $scope.unsubscribePost = function(){
      $scope.SubscribeThis = false;
      $http({method:"GET", url:'/notify/unsubscribe/'+$state.params.id}).success(function(result){
        console.log(result);
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
    $scope.upload = function(){
    
    filepicker.setKey('AFCDnLjVTqKLe4YmXaifgz');
    filepicker.pickAndStore({},{location:"S3",container:"dcard-guang"},function(InkBlob){
      console.log(InkBlob);
      $scope.photo = "https://dcard-guang.s3.amazonaws.com/" + InkBlob[0].key;;
      $scope.$apply();
      // alert("success");
    });  
  } 
    $scope.name = userName;
    $scope.school = userSchool;
    $scope.gender = userGender;
    $scope.department = userDepartment;
    $scope.grade = userGrade;
    $scope.photo = userPhoto;
    $scope.account = userAccount;

    $scope.signup = function(){
      var data = {
        name: $scope.name,
        school: $scope.school,
        gender: $scope.gender,
        department: $scope.department,
        grade: $scope.grade,
        photo: $scope.photo,
        account: $scope.account,
        member_id: userId
        // password: $scope.password
      }
      $http({method:"POST", url:'/api/signup', data:data}).success(function(result){
        if(result.msg = "success")
          alertify.success("更新成功");
        // var data = {
        // account:$scope.account,
        // password:$scope.password
        // }
        // $http({method:"POST", url:"/api/login", data:data}).success(function(post){
        //     console.log(post);
        //     window.location.reload();
        //     $location.path('/')
        // });
      })
    }

  }).
  controller('Logout', function($scope, $location, $state){
    // $rootScope.isLogin = false;
    // $rootScope.user = {};
    window.location.reload();
  }).
  controller('Profile', function($scope, $location, $state,$http,$rootScope){
    $scope.id = $state.params.id;
    // $scope.myid = $rootScope.user.user_id
    $scope.init = function(){
      $http({
        method:"GET",
        url:"/api/users/"+$scope.id
      })
      .success(function(data){
        console.log(data);
        $scope.user = data;
      })
      .error(function(){
        console.log('fail');
      })
    }

  }).
  controller('UserList', function($scope, $location, $state, $http){
    $scope.init = function(){
      $http({
        method:"GET",
        url:"/api/users"
      })
      .success(function(data){
        $scope.users = data;
        console.log($scope.users);
      })
      .error(function(){
        console.log('fail');
      })
    }
    $scope.select = function(userID){
      $location.path('/users/'+userID);
    }
  }).
  controller('Usersetting', function($scope, $location, $state,$http){
    $scope.edit = false;
    var expLen;
    $scope.init = function(){
      $http({
        method:"GET",
        url:"/api/user/me"
      })
      .success(function(data){
        if(data.Education.startdate) data.Education.startdate = moment(data.Education.startdate).format('YYYY-MM')
          if(data.Education.enddate) data.Education.enddate = moment(data.Education.enddate).format('YYYY-MM')
        _.each(data.Experiences,function(item){
          if(item.startdate) item.startdate = moment(item.startdate).format('YYYY-MM')
          if(item.enddate) item.enddate = moment(item.enddate).format('YYYY-MM')
        })
        $scope.user = data;
        console.log($scope.user)
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
    $scope.cancelsubmit = function(){
      $scope.edit = false;
      $scope.editdata = angular.copy($scope.user);
    }
    $scope.modifysubmit = function(){
      var modify = angular.copy($scope.editdata);
      var errorMsg = []
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
        _.each(data,function(item){
            if( item!=true){ 
              alertify.error(item.value+' on '+item.source+' ' +item.path);

              errorMsg.push(item)
          }
        })
        // console.log(errorMsg)
        if(errorMsg.length==0) window.location.reload();
        // if(!data.msg) {
        //   alertify.alert(data.type, function (e) {
        //         window.location.reload();
        //   });
        // }
        // else window.location.reload();
      })
      .error(function(){
        console.log('fail');
      })
    }
  });
