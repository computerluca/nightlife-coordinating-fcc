
var app = angular.module('nightlifefcc', ['usermodule','ngResource','ui.router']);
app.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})
 
app.constant('API_ENDPOINT', {
  url: 'https://votingfcc-computerluca.c9users.io/'
});
app.config(function ($httpProvider,$stateProvider, $urlRouterProvider) {
	  $httpProvider.interceptors.push('myHttpInterceptor');
  $httpProvider.interceptors.push('AuthInterceptor');

 $stateProvider.state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }
            })
                
            

                      
            
            
            
		
		.state('app.login',{
				url:'login',
				views:{
						'content@':{
								templateUrl:'views/login.html',
								controller:'LoginCtrl'
						
						
							
						}
					
					
				}
			
			
		})
.state('app.register',{
				url:'register',
				views:{
						'content@':{
								templateUrl:'views/register.html',
								controller:'RegisterCtrl'
						
						
							
						}
					
					
				}
			
			
		})
	
		
	
	
	
		
		
		
		
    $urlRouterProvider.otherwise('/')
  
  
  
    

});

/* JWT autentication inspired by https://devdactic.com/restful-api-user-authentication-1/ */
app.factory('myHttpInterceptor', function ($q) {
    return {
        responseError: function (response) {
          if(response.data){
            if(response.data.message)
           alert(response.data.message);
            else
            if(response.data.msg){
            alert(response.data.msg);
            }
          }
          return $q.reject(response);
        }
    };
});
 
app.service('AuthService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post( 'authentication/signup', user).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
 
  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post('authentication/authenticate', user).then(function(result) {
        if (result.data.success) {
          console.log(result.data.token);
          storeUserCredentials(result.data.token);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    register: register,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
  };
})
 
app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
});
