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
  controller('Userlist', function($scope, $location, $state, $http){
    $http({
        method:"GET",
        url:"/api/user/list"
      }).success(function(data){
        console.log(data);
        $scope.members = data;
      })
    $scope.queryUser = function(member_id){
      $http({
        method:"GET",
        url:"/api/user/"+member_id
      }).success(function(data){
        console.log(data);
        $scope.member = data;
        $scope.member_contact = JSON.stringify(data.Contact, undefined, 2 )
        $scope.member_experience = JSON.stringify(data.Experience, undefined, 2 )
        $scope.member_eduction = JSON.stringify(data.Education, undefined, 2 )
      })
    }
    // $rootScope.isLogin = false;
    // $rootScope.user = {};
    // window.location.reload();
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
  }).
  controller('Chart', function ($scope, $location, $state, $http){
    

    $scope.addPoints = function () {
        var seriesArray = $scope.chartConfig.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

    $scope.addSeries = function () {
        var rnd = []
        for (var i = 0; i < 10; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1)
        }
        $scope.chartConfig.series.push({
            data: rnd
        })
    }

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.chartConfig.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1)
    }

    $scope.swapChartType = function () {
        if (this.chartConfig.options.chart.type === 'column') {
            this.chartConfig.options.chart.type = 'bar'
        } else if (this.chartConfig.options.chart.type === 'bar'){
            this.chartConfig.options.chart.type = 'line'
            this.chartConfig.options.chart.zoomType = 'x'
        } else if (this.chartConfig.options.chart.type === 'line'){
            this.chartConfig.options.chart.type = 'column' 
        }
    }

    $scope.toggleLoading = function () {
        this.chartConfig.loading = !this.chartConfig.loading
    }

    $scope.seeGrade = function(){
      var obj = {};
      for(var i = 0; i < $scope.members.length; i++){
          var single = $scope.members[i].grade;
          if(single === null)single='null'
          if(obj[single] === undefined ){
            obj[single] = 1;
          }else{
            obj[single] = obj[single] + 1;
          }
      }
      var xAxis = Object.keys(obj);
      var yAxis = xAxis.map(function(i){return obj[i];});
        $scope.chartConfig.xAxis.categories= xAxis;
        $scope.chartConfig.series = [{data: yAxis}];
        $scope.chartConfig.title.text = ' education statistic, total ' + $scope.members.length;
    }

    $scope.seeGender = function(){
      var obj = {};
      for(var i = 0; i < $scope.members.length; i++){
          var single = $scope.members[i].gender;
          if(single === null)single='null'
          if(obj[single] === undefined ){
            obj[single] = 1;
          }else{
            obj[single] = obj[single] + 1;
          }
      }
      var xAxis = Object.keys(obj);
      var yAxis = xAxis.map(function(i){return obj[i];});
        $scope.chartConfig.xAxis.categories= xAxis;
        $scope.chartConfig.series = [{data: yAxis}];
        $scope.chartConfig.title.text = ' gender statistic, total ' + $scope.members.length;
    }

    $scope.seeDepartment = function(){
      var obj = {};
      for(var i = 0; i < $scope.members.length; i++){
          var single = $scope.members[i].department;
          if(single === null)single='null'
          if(obj[single] === undefined ){
            obj[single] = 1;
          }else{
            obj[single] = obj[single] + 1;
          }
      }
        var xAxis = Object.keys(obj);
        var yAxis = xAxis.map(function(i){return obj[i];});
        $scope.chartConfig.xAxis.categories= xAxis;
        $scope.chartConfig.series = [{data: yAxis}];
        $scope.chartConfig.title.text = ' Department statistic, total ' + $scope.members.length;
    }

    $scope.seeSchool = function(){
      var obj = {};
      for(var i = 0; i < $scope.members.length; i++){
          var single = $scope.members[i].school;
          if(single === null)single='null'
          if(obj[single] === undefined ){
            obj[single] = 1;
          }else{
            obj[single] = obj[single] + 1;
          }
      }
      var xAxis = Object.keys(obj);
      var yAxis = xAxis.map(function(i){return obj[i];});
        $scope.chartConfig.xAxis.categories= xAxis;
        $scope.chartConfig.series = [{data: yAxis}];
        $scope.chartConfig.title.text = ' School statistic, total ' + $scope.members.length;
    }

    $scope.seeOrganization = function(){
      var obj = {};
      for(var i = 0; i < $scope.members.length; i++){
          var single = $scope.members[i].Experiences.org;
          if(single === null)single='null'
          if(obj[single] === undefined ){
            obj[single] = 1;
          }else{
            obj[single] = obj[single] + 1;
          }
      }
      var xAxis = Object.keys(obj);
      var yAxis = xAxis.map(function(i){return obj[i];});
        $scope.chartConfig.xAxis.categories= xAxis;
        $scope.chartConfig.series = [{data: yAxis}];
        $scope.chartConfig.title.text = ' organization statistic, total ' + $scope.members.length;
    }

    $scope.seeEndDate = function(){
      var obj = {};
      for(var i = 0; i < $scope.members.length; i++){
          var single = $scope.members[i].Education.enddate;
          if(single === null)single='null'
          if(obj[single] === undefined ){
            obj[single] = 1;
          }else{
            obj[single] = obj[single] + 1;
          }
      }
      var xAxis = Object.keys(obj);
      var yAxis = xAxis.map(function(i){return obj[i];});
        $scope.chartConfig.xAxis.categories= xAxis;
        $scope.chartConfig.series = [{data: yAxis}];
        $scope.chartConfig.title.text = ' enddate statistic, total ' + $scope.members.length;
    }

    $http({
        method:"GET",
        url:"/api/user/list"
      }).success(function(data){
        console.log(data);
        $scope.members = data;
      })

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'column'
            },
                 tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     }
                 }
        },
        series: [{
            data: []
        }],
        title: {
            text: 'Hello'
        },
        xAxis: { minRange: 1,title: {text: 'number'}},
        yAxis: {title:{text:'number of persons'},minRange:1 },
        loading: false
    }

});
