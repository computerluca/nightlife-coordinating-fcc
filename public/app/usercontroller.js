'use strict';

angular.module('usermodule',[])


    app.controller('IndexController', ['$scope','AuthService','$http','$state', function ($scope,AuthService,$http,$state) {
    
     $scope.memberinfo="";
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
  $scope.search = function(){
    console.log("Searching in progress");
    $state.go('app.search', {query:$scope.location});
  }
       
   
    }]);


app.controller('LoginCtrl', function($scope, AuthService, $state,$http,$stateParams) {
  $scope.user = {
    name: '',
    password: ''
  };
    $scope.isLoggedIn = AuthService.isAuthenticated;
       
    
    if(($scope.isLoggedIn())){

	 $http.get('/authentication/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
      $("#memberinfo").text($scope.memberinfo);
  },function(err){
    alert("error retrieving user data");
  });
	}
	$scope.logout=function(){
	         AuthService.logout;
	         $state.go("/");

	}
  $scope.login=function(){
    
	  AuthService.login($scope.user)
	  .then(function(msg) {
 $http.get('/authentication/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
      $("#memberinfo").text($scope.memberinfo);
      if($stateParams.query){
        $state.go('app.search',{query:$stateParams.query});

      }
  });
  
      }, function(errMsg) {
      alert(errMsg);
	 
});
    

  
}
});
 
app.controller('RegisterCtrl', function($scope, AuthService, $state) {
  $scope.user = {
    name: '',
    password: ''
  };
  
  $scope.signup = function() {
    AuthService.register($scope.user)
     .then(function(msg) {
		alert("Effettua il login ora per accedere ai contenuti del sito");
	  $state.go('app.login');
  }), function(errMsg) {
    console.log(errMsg);
	}
};
});
 

