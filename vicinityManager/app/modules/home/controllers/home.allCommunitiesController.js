'use strict'

angular.module('VicinityManagerApp.controllers').controller('allCommunitiesController',
   function ($scope, $window, communityService, nodeAPIService, commonHelpers, Notification, configuration){

// ====== Triggers window resize to avoid bug =======
    commonHelpers.triggerResize();

// Ensure scroll on top onLoad
    $window.scrollTo(0, 0);

    $scope.imMobile = Number($window.innerWidth) < 1000;
    $(window).on('resize',function(){
      $scope.imMobile = Number($window.innerWidth) < 1000;
    });

// Initialize variables and get initial data =============

   $scope.communities=[];
   $scope.noCommunities = true;
   $scope.loaded = false;
   $scope.loadedPage = false;
   $scope.myId = $window.sessionStorage.companyAccountId;
   $scope.offset = 0;
   $scope.allItemsLoaded = false;
   $scope.typeOfItem = "communities";
   $scope.header = "Availible communities";
   $scope.newCommunityName = undefined
   $scope.newCommunityDescription = ''
   $scope.newCommunityDomain = 'Undefined'
   $scope.newCommunityNodes = [] 
   $scope.listView = false;
   $scope.myOrderBy = 'name';
   $scope.accessFilterData = [
     {id: 0, name: "My disabled "+$scope.typeOfItem},
     {id: 1, name: "My private "+$scope.typeOfItem},
     {id: 2, name: "My "+$scope.typeOfItem+" for friends"},
     {id: 3, name: "My public "+$scope.typeOfItem},
     {id: 4, name: "My "+$scope.typeOfItem},
     {id: 5, name: "Friend's "+$scope.typeOfItem},
     {id: 6, name: "All public "+$scope.typeOfItem},
   ];
   $scope.availibleDomains = ["Undefined", "Energy", "Mobility", "Health", "Farming", "Tourism", "Weather", "Indoor quality"];
   $scope.communityTypes = [{id: 0, name: "All", value: ["Community", "Partnership"]}, {id: 1, name: "Partnership", value: ["Partnership"]}, {id: 2, name: "Community", value: ["Community"]}]
   $scope.availibleDomainsObjects=[]
   $scope.selectedFilter={};
   $scope.selectedFilter.access = $scope.accessFilterData[4];
   $scope.selectedFilter.type = $scope.communityTypes[0];
   $scope.selectedFilter.domain =[];

   $scope.availibleDomains.forEach(function (domain, i) {
    $scope.availibleDomainsObjects.push({"name": domain, "id": i})
   });

  //  MODALS
  $('div#addCommunityModal').hide();
   init();

   async function init(){
     $scope.loaded = false;
     try {
        const responseItem = await getFilteredItems()
        responseItem.data.message.forEach(it => {
          $scope.communities.push(addCaptionAndAvatar(it))
        })
        $scope.noCommunities = ($scope.communities.length === 0);
        $scope.allItemsLoaded = responseItem.data.message.length < 12;
        $scope.loaded = true;
        $scope.loadedPage = true;
      } catch (err) {
        console.log(err);
        Notification.error("Server error");
      }
  }

  async function refresh(){
    $scope.communities = []
    $scope.offset = 0
    init()
  }


 /* FILTERS ACCESSED BY DOM */

  async function getFilteredItems(){
    const domain = $scope.selectedFilter.domain.map(d => d.name)
    const filter = $scope.selectedFilter.access.id
    const type = $scope.selectedFilter.type.value
    const response = await communityService.getAllCommunities(type, $scope.offset, filter, domain)
    return response
  }

$scope.onFilterChange = function(item){
  $scope.offset = 0;
  refresh();
};

/* OTHER PRIVATE FUNCTIONS */

  // Add caption based on item status and privacy
 function addCaptionAndAvatar(item){
    if(item.accessLevel === 2) { 
      item.privacyCaption = 'Public';
    } else if(item.accessLevel === 1) { 
      item.privacyCaption = 'For Friends'; 
    } else { 
      item.privacyCaption = 'Private'; 
    }
    item.avatar = item.avatar || configuration.avatarCommunity
   return item;
 }


 /* OTHER FUNCTIONS ACCESS FROM DOM */

  $scope.loadMore = function(){
      $scope.loaded = false;
      $scope.offset += 12;
      init();
  };

  $scope.changeView = function(){
    $scope.listView = !($scope.listView);
  };

  $scope.openCreateNewCommunity = async function(){
    // get APs
    try {
      const response = await nodeAPIService.getAll()
      $scope.availibleNodes = response.data.message
      $('div#addCommunityModal').show();
    } catch(err) {
      Notification.error('Unable to create new community')
      console.log(err)
    }
  };

$scope.saveModal = async function () {
  // test??
  if(!$scope.newCommunityName ){
    Notification.error("Please choose new name ");
    return
  }
  if($scope.newCommunityNodes.length === 0 ){
    Notification.error("Please choose at least one node");
    return
  }
  try {
    const communityData = {
      name:  $scope.newCommunityName,
      nodes: $scope.newCommunityNodes.map(node => node.agid),
      description: $scope.newCommunityDescription,
      domain: $scope.newCommunityDomain === 'Undefined' ? undefined : $scope.newCommunityDomain 
    }
    const response = await communityService.addCommunity(communityData)
    if(response.status == 201) {
      $('div#addCommunityModal').hide();
      Notification.success('Community ' +  $scope.newCommunityName +' created')
      $scope.newCommunityName = undefined
      $scope.newCommunityDomain = 'Undefined'
      $scope.newCommunityDescription = undefined
      $scope.newCommunityNodes = []
      refresh()
    } else {
      Notification.error('Error:' + response.message.error)
    }
  } catch (err) {
    Notification.error('Error creating community')
    console.log(err)
  }
};

$scope.closeModal = function () {
  $scope.newCommunityName = undefined
  $scope.newCommunityDomain = 'Undefined'
  $scope.newCommunityNodes = []
  $('div#addCommunityModal').hide();
};

$scope.addNode = function () {
  if($scope.selectedNewNode){
    $scope.availibleNodes = $scope.availibleNodes.filter(function(n){ 
      return n.agid != $scope.selectedNewNode.agid
    });
    $scope.newCommunityNodes.push($scope.selectedNewNode)
    $scope.newCommunityNodes = $scope.newCommunityNodes.sort((a, b) =>  a.name[0] > b.name[0] )
    $scope.availibleNodes = $scope.availibleNodes.sort((a, b) =>  a.name[0] > b.name[0] )
  }
};

$scope.removeNode = function(node) {
  $scope.newCommunityNodes = $scope.newCommunityNodes.filter(function(n){ 
    return n.agid != node.agid
  });
  $scope.availibleNodes.push(node)
  $scope.newCommunityNodes = $scope.newCommunityNodes.sort((a, b) =>  a.name[0] > b.name[0] )
  $scope.availibleNodes = $scope.availibleNodes.sort((a, b) =>  a.name[0] > b.name[0] )
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
