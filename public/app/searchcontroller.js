'use strict'
angular.module('searchmodule',[])
app.controller("searchbusinesscontroller",function($scope, $timeout,AuthService, $stateParams,$state,$http){
 $scope.isLoggedIn = AuthService.isAuthenticated;
       $scope.logout=AuthService.logout;
     if($scope.isLoggedIn()){
       $http.get('/authentication/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
      $("#memberinfo").text($scope.memberinfo);
  },function(err){
    alert("Errore retrieving user data. This is the detail of the error"+err);
  });
     }
  
    $http.get("/api/yelpapi/"+$stateParams.query).then(function(data){
       if(data){
                       $scope.results= data.data;          
                                 
           for(let i=0;i<$scope.results.length;i++){
               $http.get("/api/userplaces/"+$scope.results[i].id).then(function(data){
                        $scope.results[i].count=data.data.length;
                   
               })
               
           }

           
       }
       $scope.reserve = function(id){
           
             if(!($scope.isLoggedIn())){
                       $state.go('app.login',{query:$stateParams.query});

             }
             else{
                 if($scope.isLoggedIn()){
                     $http.post("/api/userplaces",{username:$scope.memberinfo,location:id}).then(function(data){
                           $timeout(function() {
                         if(data.data.success==true){
                                    for(let i=0;i<$scope.results.length;i++){
                                                if($scope.results[i].id==id){
                                                    $scope.results[i].count++;
                                                }
                                    }
                         }
                           },0);
                     })
                    
                 }
             }
       }
       
    },
    function(err){
        alert(err);
    })
})