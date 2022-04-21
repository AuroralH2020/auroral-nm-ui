'use strict'

angular.module('Authentication')

.factory('AuthenticationService',
        ['Base64', '$http', '$cookies', '$rootScope', '$timeout', '$window', '$location', 'configuration', 'tokenDecoder', 'Notification',
        function(Base64, $http, $cookies, $rootScope, $timeout, $window, $location, configuration, tokenDecoder, Notification){

          var service = {};

          service.recover = function(data) {
            return $http.post(configuration.apiUrl + '/login/recovery',data);
          };

          service.refresh = function(data) {
            return $http.post(configuration.apiUrl + '/login/refresh', data);
          };

          service.resetPwd = function(id, data) {
            return $http.put(configuration.apiUrl + '/login/recovery/' + id ,data);
          };

          service.Login = function(username, password) {
            return $http.post(configuration.apiUrl + '/login/authenticate', { username: username, password: password});
          };

          service.Passwordless = function(username) {
            return $http.post(configuration.apiUrl + '/login/passwordless', { username });
          };
          service.PasswordlessLogin = function(token) {
            return $http.post(configuration.apiUrl + '/login/passwordless/' + token);
          };

          

          service.signout = function(){
            service.ClearCredentialsAndInvalidateToken();
            $location.url('/login');
            $cookies.remove("r_12fg"); // If log out remove rememberMe cookie
          };

          service.SetCredentials = function(token){
            if (token) {
              $window.sessionStorage.token = token;
              var tok = tokenDecoder.deToken();
              $window.sessionStorage.username = (tok.iss) || {};
              $window.sessionStorage.userAccountId = (tok.uid) || {};
              $window.sessionStorage.companyAccountId = (tok.org) || {};
              // $http.defaults.headers.common['x-access-token'] = $window.sessionStorage.token;
            }
          };

          service.ClearCredentials = function(){
            $window.sessionStorage.removeItem('token');
            $window.sessionStorage.removeItem('username');
            $window.sessionStorage.removeItem('userAccountId');
            $window.sessionStorage.removeItem('companyAccountId');
            $http.defaults.headers.common['x-access-token'] = "";
          };


          service.ClearCredentialsAndInvalidateToken = function(){
            //TODO: Invalidate token
            try{
              var myCookie = $cookies.getObject("r_12fg");
              $http.delete(configuration.apiUrl + '/login/remember/'+ myCookie.split(':')[0])
            } catch {
              console.log('Cookie was not cleared')
            }
            service.ClearCredentials();
          };

          // If there is a cookie, look if it has assigned an id and if so refresh token and log the user
          // If the token in the cookie is faked or expired, the refresh token process will fail
          service.wasCookie = function(){
            var myCookie = $cookies.getObject("r_12fg");
            if(myCookie){
              $http.post(configuration.apiUrl + '/login/remember/', {cookie: myCookie})
                .then(
                    function successCallback(response){
                      if(!response.data.error){
                        service.SetCredentials(response.data.message);
                        $location.url("/home");
                      }else{
                        Notification.error('Token expired');
                      }
                    },
                    function errorCallback(response){
                      Notification.error('Error processing token');
                    }
                );
              }
              return false;
            };

          service.test = function(){
            console.log('this is a test')
          } 

          service.SetRememberMeCookie = function(){
            $http.get(configuration.apiUrl + '/login/remember').then(
              function successCallback(response){
                $cookies.remove("r_12fg");
                $cookies.putObject("r_12fg", response.data.message);
              }
            );
          };

          return service;
}])

//  Enconding/Decoding + JWT   =======================================

.factory('Base64', function () {
    return {
        encode: function (str) {
          // Base64 encoder
          // first we use encodeURIComponent to get percent-encoded UTF-8,
          // then we convert the percent encodings into raw bytes which
          // can be fed into btoa.
          return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
              function toSolidBytes(match, p1) {
                  return String.fromCharCode('0x' + p1);
          }));

        },

        decode: function (str) {
          // Base64 decoder
          // Going backwards: from bytestream, to percent-encoding, to original string.
          return decodeURIComponent(atob(str).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
        }
    };
})

// ======= Decode token as a service =======

.factory('tokenDecoder',
        ['Base64', '$window',
        function(Base64, $window){
          var dT = {};
          dT.deToken = function(){
            var token = $window.sessionStorage.token;
            //var header = token.split('.')[0];
            var payload = token.split('.')[1];
            //var decodedHeader = Base64.decode(header);
            var decodedPayload = Base64.decode(payload);
            var decodedPayload2 = decodedPayload.split('}')[0] + '}';
            // var headerObj = JSON.parse(decodedHeader);
            var payloadObj = JSON.parse(decodedPayload2, function(key, value){
              //console.log(key);
              return value;
            });
          return payloadObj;
      };
      return dT;
    }]
  )

.factory('HttpInterceptor', 
    ['$q', '$window', '$injector',
    function($q, $window, $injector) {
      return {
      'request': function(config) {
          config.headers = config.headers || {};
          if ($window.sessionStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
          }
          return config;
        },
        'response': function(response) {
          // console.log('responding something here...')
          return response;
        }
    };
}])

// Request and response pre-processing -- I.e. Sends JWT in every request or do refresh token
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('HttpInterceptor');
}]);

// // module is your angular module

// module.config(authInterceptorConfig);

// /* @ngInject*/
// function authInterceptorConfig($httpProvider) {
//   $httpProvider.interceptors.push('authInterceptor');
// }

// module.factory('authInterceptor', authInterceptor);

// /* @ngInject */
// function authInterceptor($q, $injector, $location, $cookies) {

//   var replays = [];
//   var refreshTokenPromise;

//   var factory = {
//     request: request,
//     responseError: responseError
//   };

//   return factory;

//   //////////

//   // Add authorization token to headers
//   function request(config) {
//     config.headers = config.headers || {};
//     if ($cookies.get('token')) {
//       config.headers.Authorization = 'Bearer ' + $cookies.get('token');
//     }

//     return config;
//   }

//   // Intercept 401s and redirect you to login
//   function responseError(response) {
//     if (response.status === 401 && $cookies.get('token')) {
//       return checkAuthorization(response);
//     }

//     return $q.reject(response);

//     /////////

//     function checkAuthorization(res) {
//       return $q(function(resolve, reject) {

//         var replay = {
//           success: function(){
//             $injector.get('$http')(res.config).then(resolve, reject);
//           },

//           cancel: function(){
//             reject(res);
//           }
//         };

//         replays.push(replay);

//         if (!refreshTokenPromise) {
//           refreshTokenPromise = $injector.get('Auth') // REFRESH TOKEN HERE
//             .refreshToken()
//             .then(clearRefreshTokenPromise)
//             .then(replayRequests)
//             .catch(cancelRequestsAndRedirect);
//         }
//       });

//       ////////////

//       function clearRefreshTokenPromise(auth) {
//         refreshTokenPromise = null;
//         return auth;
//       }

//       function replayRequests(auth) {
//         replays.forEach(function(replay) {  
//           replay.success();
//         });

//         replays.length = 0;

//         return auth;
//       }

//       function cancelRequestsAndRedirect() {

//         refreshTokenPromise = null;
//         replays.forEach(function(replay) {  
//           replay.cancel();
//         });

//         replays.length = 0;

//         $cookies.remove('token');
//         var $state = $injector.get('$state');

//         // SET YOUR LOGIN PAGE
//         $state.go('login');
//       }
//     }
//   }
// }