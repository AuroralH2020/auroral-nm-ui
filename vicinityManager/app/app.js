'use strict';

angular.module('constants',[]).constant('configuration', this._env);

angular.module('Authentication', ['ngCookies', 'constants', 'ui-notification','VicinityManagerApp.controllers']);
angular.module('Registration', ['ngCookies', 'constants', 'VicinityManagerApp.controllers']);

// Declare app level module which depends on views, and components
angular.module('VicinityManagerApp', [
//  'ngRoute',
  'ui.router',
  'VicinityManagerApp.controllers',
  'VicinityManagerApp.services',
  'VicinityManagerApp.filters',
  'VicinityManagerApp.version',
  'ngCookies',
  'ui-notification',
  'Authentication',
  'Registration',
  'constants',
  'angularFileUpload',
  'ui.select',
  'ngSanitize'
])
.config(function($stateProvider, $urlRouterProvider) {
// Cache
// ====== HOME VIEW =======

    $stateProvider
        .state('root', {
          abstract: true,
          templateUrl: 'modules/home/views/home.html',
          controller: 'homeController',
        })
        .state('root.main', {
          url: '',
          abstract:true,
          views: {
            'notificationsMenuView':
              {
                templateUrl: 'modules/home/views/home.notificationsMenuView.html',
                controller: 'notifications'
              },
              'searchUp':
                {
                  templateUrl: 'modules/home/views/home.searchUpView.html',
                  controller: 'searchUpController'
                },
              'settingsMenuView':
                {
                  templateUrl: 'modules/home/views/home.settingsMenuView.html',
                  controller: 'settingsController'
                },
              'userAccountView':
                {
                  templateUrl: 'modules/home/views/home.userAccountView.html',
                  controller: 'userAccountController'
                },
              'companyAccountView':
                {
                  templateUrl: 'modules/home/views/home.companyAccountView.html',
                  controller: 'companyAccountController'
                }
            }
          })
          .state('root.main.home', {
            url: '/home',
            views: {
              'mainContentView@root':
                {
                  templateUrl: 'modules/home/views/home.allItemsView.html',
                  controller: 'allItemsController'
                }
            }
          })

// ======== Side menu list views

        .state('root.main.allItems', {
          url: '/allItems/:searchTerm',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.allItemsView.html',
                controller: 'allItemsController'
              }
          }
        })

        .state('root.main.allEntities', {
          url: '/allEntities',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.allEntities.html',
                controller: 'allEntities'
              }
          }
        })

        .state('root.main.allMarketplaces', {
          url: '/allMarketplaces',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.allMarketplacesView.html',
                controller: 'allMarketplacesController'
              }
          }
        })

        .state('root.main.allContracts', {
          url: '/allContracts',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.allContractsView.html',
                controller: 'allContractsController'
              }
          }
        })

        .state('root.main.allCommunities', {
          url: '/allCommunities',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.allCommunitiesView.html',
                controller: 'allCommunitiesController'
              }
          }
        })

        .state('root.main.allRegistrations', {
          url: '/allRegistrations',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.registrationMasterDetail.html',
                controller: 'allRegistrationsController'
              }
          }
        })

        .state('root.main.allSessions', {
          url: '/allSessions',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.sessions.html',
                controller: 'sessionsController'
              }
          }
        })

        .state('root.main.api_keys', {
          url: '/apiKeys',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.api_keys.html',
                controller: 'api_keysController'
              }
          }
        })

        .state('root.main.myNodes', {
          url: '/myNodes',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.myNodesView.html',
                controller: 'myNodesController'
              }
          }
        })

        .state('root.main.counters', {
          url: '/counters',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.counters.html',
                controller: 'countersController'
              }
          }
        })
        .state('root.main.myNotifications', {
          url: '/myNotifications',
          views: {
            'mainContentView@root':
              {
                templateUrl: 'modules/home/views/home.myNotificationsView.html',
                controller: 'myNotificationsController'
              }
          }
        })

// =========  Sub views of items in side menu / PROFILES =========

        .state('root.main.searchresults', {
          url: '/search/:searchTerm',
          views: {
            'mainContentView@root':
                {
                  templateUrl: 'modules/home/views/home.searchView.html',
                  controller: 'searchController'
                }
          }
        })

        .state('root.main.companyProfile', {
          url: '/profile/company/:companyAccountId',
          views: {
            'mainContentView@root':
            {
              templateUrl: 'modules/home/views/home.companyProfileView.html',
              controller:  'companyProfileController'
            }
          }
        })


        .state('root.main.companyProfile.items', {
            url: '/items',
            views: {
                'tabPanel@root.main.companyProfile':
                    {
                        templateUrl: 'modules/home/views/home.companyProfile.itemsView.html',
                        controller: 'cPitemsController'
                    }
            }
        })

        // .state('root.main.companyProfile.services', {
        //     url: '/services',
        //     views: {
        //         'tabPanel@root.main.companyProfile':
        //             {
        //                 templateUrl: 'modules/home/views/home.companyProfile.servicesView.html',
        //                 controller: 'cPservicesController'
        //             }
        //     }
        // })

        .state('root.main.companyProfile.friends', {
            url: '/partners',
            views: {
                'tabPanel@root.main.companyProfile':
                    {
                        templateUrl: 'modules/home/views/home.companyProfile.friendsView.html',
                        controller: 'cPfriendsController'
                    }
            }
        })
        .state('root.main.companyProfile.history', {
            url: '/history',
            views: {
                'tabPanel@root.main.companyProfile':
                    {
                        templateUrl: 'modules/home/views/home.companyProfile.historyView.html',
                        controller: 'cPhistoryController'
                    }
            }
        })

        .state('root.main.companyProfile.userAccounts', {
            url: '/userAccounts',
            views: {
                'tabPanel@root.main.companyProfile':
                    {
                        templateUrl: 'modules/home/views/home.companyProfile.userAccountsView.html',
                        controller: 'cPuserAccountsController'
                    }
            }
        })

        .state('root.main.companyProfile.invitations', {
          url: '/invitations',
          views: {
              'tabPanel@root.main.companyProfile':
                  {
                      templateUrl: 'modules/home/views/home.companyProfile.invitationsView.html',
                      controller: 'cPinvitationsController'
                  }
          }
      })

        .state('root.main.companyProfile.roleMgmt', {
            url: '/roleMgmt',
            views: {
                'tabPanel@root.main.companyProfile':
                    {
                        templateUrl: 'modules/home/views/home.companyProfile.roleMgmtView.html',
                        controller: 'cProleController'
                    }
            }
        })

        // TODO add services

        // .state('root.main.serviceProfile', {
        //   url: '/profile/service/:serviceId',
        //   views: {
        //     'mainContentView@root':
        //     {
        //       templateUrl: 'modules/home/views/home.serviceProfileView.html',
        //       controller:  'serviceProfileController'
        //     }
        //   }
        // })

        // .state('root.main.serviceProfile.history', {
        //   url: '/history',
        //   views: {
        //     'tabPanel@root.main.serviceProfile':
        //     {
        //       templateUrl: 'modules/home/views/home.serviceProfile.historyView.html',
        //       controller:  'sPhistoryController'
        //     }
        //   }
        // })

        // .state('root.main.serviceProfile.whoSee', {
        //   url: '/whoSee',
        //   views: {
        //     'tabPanel@root.main.serviceProfile':
        //     {
        //       templateUrl: 'modules/home/views/home.serviceProfile.whoSeeView.html',
        //       controller:  'sPwhoSeeController'
        //     }
        //   }
        // })

        // .state('root.main.serviceProfile.description', {
        //   url: '/description',
        //   views: {
        //     'tabPanel@root.main.serviceProfile':
        //     {
        //       templateUrl: 'modules/home/views/home.serviceProfile.description.html',
        //       controller:  'sPdescriptionController'
        //     }
        //   }
        // })
        .state('root.main.marketplaceProfile', {
          url: '/profile/marketplace/:itemId',
          views: {
            'mainContentView@root':
            {
              templateUrl: 'modules/home/views/home.marketplaceView.html',
              controller:  'marketplaceProfileController'
            }
          }
        })

        .state('root.main.itemProfile', {
          url: '/profile/item/:itemId',
          views: {
            'mainContentView@root':
            {
              templateUrl: 'modules/home/views/home.itemProfileView.html',
              controller:  'itemProfileController'
            }
          }
        })

        .state('root.main.itemProfile.history', {
          url: '/history',
          views: {
            'tabPanel@root.main.itemProfile':
            {
              templateUrl: 'modules/home/views/home.itemProfile.historyView.html',
              controller:  'iPhistoryController'
            }
          }
        })

        // .state('root.main.itemProfile.whoSee', {
        //   url: '/whoSee',
        //   views: {
        //     'tabPanel@root.main.itemProfile':
        //     {
        //       templateUrl: 'modules/home/views/home.itemProfile.whoSeeView.html',
        //       controller:  'dPwhoSeeController'
        //     }
        //   }
        // })

        .state('root.main.itemProfile.description', {
          url: '/description',
          views: {
            'tabPanel@root.main.itemProfile':
            {
              templateUrl: 'modules/home/views/home.itemProfile.description.html',
              controller:  'iPdescriptionController'
            }
          }
        })

        .state('root.main.userProfile', {
          url: '/profile/user/:companyAccountId/:userAccountId',
          views: {
            'mainContentView@root':
            {
              templateUrl: 'modules/home/views/home.userProfileView.html',
              controller:  'userProfileController'
            }
          }
        })

        .state('root.main.userProfile.items', {
          url: '/items',
          views: {
            'tabPanel@root.main.userProfile':
            {
              templateUrl: 'modules/home/views/home.userProfileView.items.html',
              controller:  'uPitemsController'
            }
          }
        })

        .state('root.main.userProfile.services', {
          url: '/services',
          views: {
            'tabPanel@root.main.userProfile':
            {
              templateUrl: 'modules/home/views/home.userProfileView.services.html',
              controller:  'uPservicesController'
            }
          }
        })

        .state('root.main.userProfile.history', {
          url: '/history',
          views: {
            'tabPanel@root.main.userProfile':
            {
              templateUrl: 'modules/home/views/home.userProfileView.history.html',
              controller:  'uPhistoryController'
            }
          }
        })

        .state('root.main.registrationProfile', {
          url: '/profile/registration/:registrationId',
          views: {
            'mainContentView@root':
            {
              templateUrl: 'modules/home/views/home.registrationProfile.html',
              controller:  'registrationProfileController'
            }
          }
        })

        .state('root.main.registrationProfile.regAdmin', {
          url: '/regAdmin',
          views: {
            'tabPanel@root.main.registrationProfile':
            {
              templateUrl: 'modules/home/views/home.registrationProfile.regAdminView.html',
              controller:  'rPregAdminController'
            }
          }
        })

        .state('root.main.contractProfile', {
          url: '/profile/contract/:contractId',
          views: {
            'mainContentView@root':
            {
              templateUrl: 'modules/home/views/home.contractProfileView.html',
              controller:  'contractProfileController'
            }
          }
        })

        .state('root.main.contractProfile.history', {
          url: '/history',
          views: {
            'tabPanel@root.main.contractProfile':
            {
              templateUrl: 'modules/home/views/home.conProfile.HistoryView.html',
              controller:  'conProfileHistoryController'
            }
          }
        })
        
        .state('root.main.contractProfile.items', {
          url: '/items',
          views: {
            'tabPanel@root.main.contractProfile':
            {
              templateUrl: 'modules/home/views/home.conProfile.itemsView.html',
              controller:  'conProfileItemsController'
            }
          }
        })

        .state('root.main.contractProfile.edit', {
          url: '/edit',
          views: {
            'tabPanel@root.main.contractProfile':
            {
              templateUrl: 'modules/home/views/home.conProfile.EditView.html',
              controller:  'conProfileEditController'
            }
          }
        })

        .state('root.main.communityProfile', {
          url: '/profile/community/:commId',
          views: {
            'mainContentView@root':
            {
              templateUrl: 'modules/home/views/home.communityProfileView.html',
              controller:  'communityProfileController'
            }
          }
        })
        .state('root.main.communityProfile.nodes', {
          url: '/nodes',
          views: {
            'tabPanel@root.main.communityProfile':
            {
              templateUrl: 'modules/home/views/home.communityProfile.nodesView.html',
              controller:  'comProfNodesController'
            }
          }
        })
        .state('root.main.communityProfile.edit', {
          url: '/edit',
          views: {
            'tabPanel@root.main.communityProfile':
            {
              templateUrl: 'modules/home/views/home.communityProfile.editView.html',
              controller:  'comProfEditController'
            }
          }
        })

        .state('root.main.nodeDetail', {
          url: '/nodeDetail/:nodeId',
          params: {
            modify: false
          },
          views: {
            'mainContentView@root':
            {
              templateUrl: 'modules/home/views/home.nodeDetail.html',
              controller:  'nodeDetailController'
            }
          }
        })
// ======= Login, Auth, invit, reg VIEWS ======

        .state('invitationOfNewUser', {
          url: '/invitation/newUser/:invitationId',
          templateUrl: 'modules/registration/views/invitation.newUser.html',
          controller: 'invitationNewUserController',
          // onEnter: function(){
          //  console.log('Activating state new user');
          // }
        })

        .state('invitationOfNewCompany', {
          url: '/invitation/newCompany/:invitationId',
          templateUrl: 'modules/registration/views/invitation.newCompany.html',
          controller: 'invitationNewCompanyController',
          // onEnter: function(){
          //  console.log('Activating state new company');
          // }
        })

        .state('registrationOfNewUser', {
          url: '/registration/newUser/:registrationId',
          templateUrl: 'modules/registration/views/registration.newUser.html',
          controller: 'registrationNewUserController',
          // onEnter: function(){
          //  console.log('Activating state new user reg');
          // }
        })

        .state('registrationOfNewCompany', {
          url: '/registration/newCompany/:registrationId',
          templateUrl: 'modules/registration/views/registration.newCompany.html',
          controller: 'registrationNewCompanyController',
          // onEnter: function(){
          //   console.log('Activating state new company reg');
          // }
        })

        .state('recoverPassword', {
          url: '/authentication/recoverPassword/:userId',
          templateUrl: 'modules/authentication/views/recoverPassword.html',
          controller: 'recoverPasswordController',
          // onEnter: function(){
          //   console.log('Activating state password recovery');
          // }
        })

        .state('passwordlessLogin', {
          url: '/authentication/passwordlessLogin/:token',
          templateUrl: 'modules/authentication/views/passwordlessLogin.html',
          controller: 'passwordlessLoginController',
        })

        .state('login', {
          url: '/login',
          templateUrl: 'modules/authentication/views/login.html',
          controller: 'LoginController',
          // onEnter: function(){
          //   console.log('Activating state home');
          // }
        });

})

//Angular UI Notification configuration;
.config(function (NotificationProvider) {
    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'left',
        positionY: 'bottom'
    });
  })

.run(['$rootScope', '$location', '$cookies', '$http', '$window', '$stateParams',
      function($rootScope, $location, $cookies, $http, $window, $stateParams){

          FastClick.attach(document.body);

        $rootScope.$on('$stateChangeSuccess', function(){ // In case of state change do following actions...
          $rootScope.styles = ['hold-transition', 'skin-' + $rootScope.skinColor, 'sidebar-mini']; // checks if the skinColor changed
          $(window).trigger('resize'); // Prevents side bar bug
        });

        if ($window.sessionStorage.token) {
          $http.defaults.headers.common['x-access-token'] = $window.sessionStorage.token;
        }

        $rootScope.$on('$locationChangeStart', function(evetn, next, current) {

          if(($location.url() !== '/login') && !$window.sessionStorage.token){
            //TODO: Check validy of the token, if token is invalid. Clear credentials and pass to the login page.

            // var p = $location.url();
            var path = $location.hash();

            // Divide url and param
            var lastPos = path.lastIndexOf("/");
            var param = path.substring(lastPos + 1, path.length);
            var url = path.substring(0, lastPos + 1);

            // Check if non valid characters in param
            var uriValid = /[0-9a-fA-F]+/ ;
            var check = uriValid.test(param);

            if ((url.indexOf('/invitation/newCompany/')) !== -1 && check){
              $location.path('/invitation/newCompany/' + param);
            }else if ((url.indexOf('/invitation/newUser/')) !== -1 && check){
              $location.path('/invitation/newUser/' + param);
            }else if ((url.indexOf('/registration/newCompany/')) !== -1 && check){
              $location.path('/registration/newCompany/' + param);
            }else if ((url.indexOf('/registration/newUser/')) !== -1 && check){
              $location.path('/registration/newUser/' + param);
            }else if ((url.indexOf('/authentication/passwordlessLogin/')) !== -1 && check){
              $location.path('/authentication/passwordlessLogin/' + param);
            }else if ((url.indexOf('/authentication/recoverPassword/')) !== -1 && check){
              $location.path('/authentication/recoverPassword/' + param);
            }else{
              $location.path('/login');
            }
          }
        });

      }]);
