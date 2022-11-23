'use strict'

angular.module('Authentication')

.factory('AuthenticationService',
        ['Base64', '$http', '$cookies', '$rootScope', '$timeout', '$window', '$location', 'configuration', 'tokenDecoder', 'Notification',
        function(Base64, $http, $cookies, $rootScope, $timeout, $window, $location, configuration, tokenDecoder, Notification){

          var service = {};

          service.recover = function(data) {
            return $http.post(configuration.apiUrl + '/auth/password/recovery', data);
          };

          service.refresh = function() {
            return $http.post(configuration.apiUrl + '/auth/token/refresh', { refreshToken: $window.sessionStorage.refreshToken });
          };

          service.resetPwd = function(id, data) {
            return $http.put(configuration.apiUrl + '/auth/password/recovery/' + id ,data);
          };

          service.Login = function(username, password) {
            return $http.post(configuration.apiUrl + '/auth/token', { username: username, password: password});
          };

          service.Passwordless = function(username) {
            return $http.post(configuration.apiUrl + '/auth/login/passwordless', { username });
          };
          service.PasswordlessLogin = function(token) {
            return $http.post(configuration.apiUrl + '/auth/login/passwordless/' + token);
          };

          service.signout = function(){
            service.ClearCredentialsAndInvalidateToken();
            $location.url('/login');
            $cookies.remove("r_12fg"); // If log out remove rememberMe cookie
          };

          service.SetCredentials = function(data){
            if (data) {
              $window.sessionStorage.token = data.token;
              $window.sessionStorage.refreshToken = data.refreshToken;
              var tok = tokenDecoder.deToken();
              $window.sessionStorage.username = tok.mail || {};
              $window.sessionStorage.userAccountId = tok.sub || {};
              $window.sessionStorage.companyAccountId = tok.org || {};
              $window.sessionStorage.expiration = tok.exp || {};
              // Renew token
              $timeout(service.refreshToken, 60000*60) // Refresh token every hour
              // $http.defaults.headers.common['x-access-token'] = $window.sessionStorage.token;
            }
          };

          service.ClearCredentials = function(){
            $window.sessionStorage.removeItem('token');
            $window.sessionStorage.removeItem('refreshToken');
            $window.sessionStorage.removeItem('username');
            $window.sessionStorage.removeItem('userAccountId');
            $window.sessionStorage.removeItem('companyAccountId');
            $window.sessionStorage.removeItem('expiration');
            // $http.defaults.headers.common['x-access-token'] = "";
          };


          service.ClearCredentialsAndInvalidateToken = function(){
            //TODO: Invalidate token
            try{
              var myCookie = $cookies.getObject("r_12fg");
              $http.delete(configuration.apiUrl + '/auth/login/remember/'+ myCookie.split(':')[0])
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
              $http.post(configuration.apiUrl + '/auth/login/remember/', {cookie: myCookie})
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

          service.SetRememberMeCookie = function(){
            $http.get(configuration.apiUrl + '/auth/login/remember').then(
              function successCallback(response){
                $cookies.remove("r_12fg");
                $cookies.putObject("r_12fg", response.data.message);
              }
            );
          };

          service.refreshToken = function(){
            service.refresh().then(
              function successCallback(response){
                service.SetCredentials(response.data.message)
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

.factory('tokenDecoder', ['Base64', '$window',
    function(Base64, $window){
      return {
        deToken: () => {
        var token = $window.sessionStorage.token;
        //var header = token.split('.')[0];
        var payload = token.split('.')[1];
        //var decodedHeader = Base64.decode(header);
        var decodedPayload = Base64.decode(payload);
        decodedPayload = decodedPayload.split('}')[0] + '}';
        // var headerObj = JSON.parse(decodedHeader);
        var payloadObj = JSON.parse(decodedPayload)
        return payloadObj;
      }
    }
  }]
)

.factory('HttpInterceptor', 
    ['$q', '$window', '$injector',
    function($q, $window, $injector) {
      return {
      'request': (config) => {
          config.headers = config.headers || {};
          if ($window.sessionStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            // TBD renew token if expiring soon (Consider using timeout instead)
          }
          return config;
        },
        // 'response': function(response) {
        //   // console.log(response.data.message)
        //   return response;
        // },
        'responseError': (response) => {
          if (response.status === 401) {
            $injector.get('Notification').error(response.statusText + ': ' + response.data.error)
            $injector.get('AuthenticationService').signout()
          } else if (response.status === 403 || response.status === 404) {
            $injector.get('Notification').warning(response.statusText + ': ' + response.data.error)
          } else {
            $injector.get('Notification').error(response.statusText + ': ' + response.data.error)
          }
          return response;
        }
    };
}])

// Request and response pre-processing -- I.e. Sends JWT in every request or do refresh token
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('HttpInterceptor');
}]);
