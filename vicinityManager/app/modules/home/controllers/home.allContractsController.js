'use strict'
angular.module('VicinityManagerApp.controllers').controller('allContractsController',
   function ($scope, $window, contractAPIService, commonHelpers, Notification, configuration){

// ====== Triggers window resize to avoid bug =======
    commonHelpers.triggerResize();

// Ensure scroll on top onLoad
    $window.scrollTo(0, 0);

    $scope.imMobile = Number($window.innerWidth) < 1000;
    $(window).on('resize',function(){
      $scope.imMobile = Number($window.innerWidth) < 1000;
    });

// Initialize variables and get initial data =============

   $scope.contracts=[];
   $scope.noItems = true;
   $scope.loaded = false;
   $scope.loadedPage = false;
   $scope.myId = $window.sessionStorage.companyAccountId;
   $scope.offset = 0;
   $scope.allItemsLoaded = false;
   $scope.typeOfItem = "Contracts";
   $scope.header = "My Contracts";
   $scope.listView = false;
   $scope.myOrderBy = 'name';
   $scope.myCid = $window.sessionStorage.companyAccountId


   init();

   async function init(){
     $scope.loaded = false;
     try {
        const responseItem = await loadData()
        $scope.noItems = ($scope.contracts.length === 0);
        $scope.allItemsLoaded = responseItem.data.message.length < 12;
        $scope.loaded = true;
        $scope.loadedPage = true;
      } catch (err) {
        console.log(err);
        Notification.error("Server error");
      }
  }

  $scope.refresh = async function(){
    $scope.items=[];
    $scope.loaded = false;
    try {
      const responseItem = await loadData()
        $scope.noItems = ($scope.items.length === 0);
        $scope.allItemsLoaded = responseItem < 12;
        $scope.loaded = true;
        $scope.loadedPage = true;
      } catch (error) {
        console.log(error);
        Notification.error("Server error");
     };
 };



 /* FILTERS ACCESSED BY DOM */

    /* OTHER PRIVATE FUNCTIONS */
   async function loadData(){
       const responseItem = await contractAPIService.getContracts()
        $scope.contracts=[];
        responseItem.data.message.forEach(it => {
            it.avatar = configuration.avatarContract
            it.displayName ='';
            if (it.type === 'Private') {
              const orgs = (it.organisationsWithName).concat(it.pendingOrganisationsWithName)
              orgs.forEach((org)=>{
                if(org.cid !== $scope.myCid){
                  it.displayName += org.name
                }
              })
            }

            $scope.contracts.push(it);
        });
        return responseItem
    }

  // Add caption based on item status and privacy

/* OTHER FUNCTIONS ACCESS FROM DOM */

  $scope.loadMore = function(){
      $scope.loaded = false;
      $scope.offset += 12;
      init();
  };

  $scope.changeView = function(){
    $scope.listView = !($scope.listView);
  };

  $scope.orderByMe = function(x) {
    if($scope.myOrderBy === x){
      $scope.rev=!($scope.rev);
    }
    $scope.myOrderBy = x;
  };

  $scope.onSort = function(order){
    $scope.rev = order;
  };

});
