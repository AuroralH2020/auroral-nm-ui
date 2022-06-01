'use strict';
angular.module('VicinityManagerApp.controllers')
  .controller('itemProfileController',
    function($scope, $window, $state, commonHelpers, imageHelpers,  tokenDecoder, $stateParams, $location, itemsAPIService, contractAPIService, Notification, configuration) {

      $scope.locationPrefix = $location.path();

    // Initialize variables and data

      commonHelpers.triggerResize(); // Triggers window resize to avoid bug

      $scope.itemEnabled = false;
      $scope.showInput = false;
      $scope.isMyItem = false;
      $scope.isMyOrgItem = false;
      $scope.imDeviceOwner = false;
      $scope.imAdmin = false;
      $scope.loaded = false;
      $scope.item = {};
      $scope.accessLevelNew = 0;
      $scope.visibilityCaption = ["Private", "Partners with Data Under Request", "Public with Data Under Request"];
      $scope.ALcaption = "Private"
      // modal
      $scope.modalText = "";
      $scope.askedFunction


    // initialize DOM

      // $('div#moveEdit').show();
      // $('a#moveSave').hide();
      // $('a#moveCancel').hide();
      // $('select#editMoveName').hide();

    // Initialize controller

      initData();

    // Listen for changes and broadcast to children

      $scope.$watch('item', function (value) {
        $scope.$broadcast('itemChanged', value);
      });
      $('div#keymodal').hide();

    // Functions
    
      function initData() {
        itemsAPIService.getItemWithAdd($stateParams.itemId)
          .then(function(response) {
            $scope.isMyItem = false;
            $scope.isMyOrgItem = false;
            $scope.loaded = false;
            try {
              $scope.item = response.data.message;
              // calculate lastSeen
              const d = new Date()
              d.setSeconds(d.getSeconds() - 900 + $scope.item.ttl)
              $scope.item.lastSeen = d.toLocaleString()

              $scope.item.uid = $scope.item.uid === undefined ? {} : $scope.item.uid; // Case device disabled
              $scope.itemEnabled = $scope.item.status === 'Enabled';
              $scope.ALcaption = $scope.visibilityCaption[$scope.item.accessLevel];
              $scope.item.avatar = $scope.item.avatar || configuration.avatarItem
              $scope.isMyItem = $window.sessionStorage.userAccountId === $scope.item.uid;
              $scope.isMyOrgItem = $window.sessionStorage.companyAccountId === $scope.item.cid;
              getToken();
              $scope.loaded = true;
            } catch (err) {
              console.log(err);
              Notification.error("Problem initializing data");
            }
          })
          .catch(function(err) {
            if (err.status === 404) {
              console.log(err);
              Notification.error("Item not found");
              $state.go("root.main.allItems");
            } else {
              console.log(err);
              Notification.error("Server error");
            }
          });
      }

      $scope.childHook = function (){
        initData()
      }
      function getToken() {
        const payload = tokenDecoder.deToken()
        const rolesArr = payload.roles.split(',')
        for (var i in rolesArr) {
          if (rolesArr[i] === 'device owner') {
            $scope.imDeviceOwner = true;
          }
          if (rolesArr[i] === 'administrator') {
            $scope.imAdmin = true;
          }
        }
      }

      /* MAIN FUNCTIONS */

      // Change status
      $scope.changeStatus = async function() {
        try {
          if($scope.item.hasContracts.length > 0) {
            // ask if remove from contracts
            // $scope.showModal()
            $scope.testFunction('Item will be removed from contract. Are you sure?', async function () {
              try {
              for (const ctid of ($scope.item.hasContracts)) {
                    await contractAPIService.removeContractItem(ctid, $scope.item.oid)
              };
              const query = $scope.item.status === 'Enabled' ?
                              { "status": 'Disabled' } :
                              { "status": 'Enabled' }
                await itemsAPIService.putOne($scope.item.oid, query)
                Notification.success('Item status updated!!');
                initData();
              } catch (err) {
                if (err.status < 500) {
                  Notification.warning(err.data.error);
                } else {
                  Notification.error("Server error");
                }
              }
            })
            return
          }
          const query = $scope.item.status === 'Enabled' ?
                        { "status": 'Disabled' } :
                        { "status": 'Enabled' }
          await itemsAPIService.putOne($scope.item.oid, query)
          Notification.success('Item status updated!!');
          initData();
        } catch (err) {
          if (err.status < 500) {
            Notification.warning(err.data.error);
          } else {
            Notification.error("Server error");
          }
        }
      };

      // Delete items
      $scope.deleteItem = async function() {
        $scope.testFunction('Are you sure?', async function () {
          try {
            await itemsAPIService.deleteItem($scope.item.oid)
            Notification.success('Device deleted');
            $state.go("root.main.home");
          } catch (err) {
            if (err.status < 500) {
              Notification.warning('Problem deleting device');
              $state.go("root.main.home");
            } else {
              Notification.error("Server error");
            }
          }
        })
      }
      // Contract
      $scope.requestContract = async function() {
        try {
          await contractAPIService.addContractItem($scope.item.contract.ctid, $scope.item.oid)
          Notification.success('Item requested');
          initData();
        } catch (err) {
          if (err.status < 500) {
            Notification.warning('Problem requesting item');
            console.log(err)
            initData();
          } else {
            Notification.error("Server error");
          }
        }
      };
      
      // Access Level
      $scope.saveNewAccess = async function() {
        if (Number($scope.accessLevelNew) !== 0) {
          try {
            // Item is contracted
            if (Number($scope.accessLevelNew) == 1 && $scope.item.hasContracts.length > 0) {
              // ask if remove from contract
              $scope.testFunction('Item will be removed from contract. Are you sure?', async function () {
                // remove from all contracts
                try {
                  for (const ctid of ($scope.item.hasContracts)) {
                    await contractAPIService.removeContractItem(ctid, $scope.item.oid)
                  }
                  await itemsAPIService.putOne($scope.item.oid, {
                    accessLevel: Number($scope.accessLevelNew) - 1
                    })
                    Notification.success("Access level updated");
                    initData();
                    
                } catch (err) {
                  if (err.status < 500) {
                    Notification.warning(err.data.error);
                  } else {
                    Notification.error("Server error");
                  }
                }
              })
              return
            }
            // Changing access level
            await itemsAPIService.putOne($scope.item.oid, {
            accessLevel: Number($scope.accessLevelNew) - 1
            })
            Notification.success("Access level updated");
            initData();
          } catch (err) {
            if (err.status < 500) {
              Notification.warning(err.data.error);
            } else {
              Notification.error("Server error");
            }
          }
        }
      };
      // ask and do
      $scope.testFunction = function (question, fun){
        $scope.askedFunction = fun
        $scope.modalText = question
        $scope.showModal()
      }

      // Modal
      $scope.showModal = function (id) {
          $('div#keymodal').show();
      };
      $scope.modalOk = async function(){
        $('div#keymodal').hide();
        await $scope.askedFunction()
      }
      $scope.modalCancel = function(){
        $('div#keymodal').hide();
      } 
      // Load picture mgmt
      var base64String = "";

      $("input#input1").on('change', function(evt) {
        var tgt = evt.target || window.event.srcElement,
          files = tgt.files;
          var img = new Image;
          img.src = URL.createObjectURL(tgt.files[0]);
          img.onload = function() {
            base64String = imageHelpers.resizeImage(img, 120, 120, 0); //HERE IS WHERE THE FUNCTION RESIZE IS CALLED!!!!
            $("img#pic").prop("src", base64String);
          }
      });

      $scope.showLoadPic = function() {
        $scope.showInput = true;
        $('#editCancel1').fadeIn('slow');
        $('#editUpload2').fadeIn('slow');
        $('#input1').fadeIn('slow');
      };

      $scope.cancelLoadPic = function() {
        $('#editCancel1').fadeOut('slow');
        $('#editUpload2').fadeOut('slow');
        $('#input1').fadeOut('slow');
        $('img#pic').fadeOut('slow');
        setTimeout(function() {
          $("img#pic").prop("src", $scope.item.avatar);
          $('img#pic').fadeIn('slow');
        }, 600);
        $('#input1').val('')
      };

      $scope.uploadPic = async function() {
        try {
          //test if image is selected
          if($('#input1').val() === ''){
            Notification.warning("Please select image");
            return
          }
          await itemsAPIService.putOne($scope.item.oid, {
            avatar: base64String
          })
          const response = await itemsAPIService.getItemWithAdd($stateParams.itemId)
          Notification.success("Avatar updated");
          $scope.item = response.data.message;
          $('#editCancel1').fadeOut('slow');
          $('#editUpload2').fadeOut('slow');
          $('#input1').fadeOut('slow');
          $('img#pic').fadeOut('slow');
          setTimeout(function() {
            $("img#pic").prop("src", $scope.item.avatar);
            $('img#pic').fadeIn('slow');
          }, 600);
          $('#input1').val('')
        } catch (err) {
          if (err.status < 500) {
            Notification.error("Error changing image. Check source");
          } else {
            Notification.error("Server error");
          }
        }
      };
      
      $scope.copyToClipboard = function (oid, id='ID') {
        navigator.clipboard.writeText(oid).then(function() {
          Notification.success(id + " has been copied");
        }, function(err) {
          Notification.error("Could not copy text");
        });
      }
            // Move / Change item owner/gateway

            // $scope.changeToInputMove = function() {
            //   $('div#moveEdit').hide();
            //   $('select#editMoveName').fadeIn('slow');
            //   $('a#moveSave').fadeIn('slow');
            //   $('a#moveCancel').fadeIn('slow');
            // };
      
            // $scope.backToEditMove = function() {
            //   $('a#moveCancel').fadeOut('slow');
            //   $('a#moveSave').fadeOut('slow');
            //   $('select#editMoveName').fadeOut('slow');
            //   setTimeout(function() {
            //     $('div#moveEdit').fadeIn('fast');
            //   }, 600);
            // };
      
            // $scope.saveNewAccessMove = function() {
            //   var newThing = JSON.parse($('select#editMoveName').val());
            //   var item = {
            //     id: $scope.item._id,
            //     extid: $scope.item.oid,
            //     name: $scope.item.name
            //   };
            //   if (newThing.hasOwnProperty("adid")) {
            //     var adid = {
            //       id: newThing._id,
            //       extid: newThing.adid,
            //       name: newThing.name,
            //       type: $scope.gateway.type
            //     };
            //     itemsAPIService.changeGateway({
            //         oid: item,
            //         adid: adid
            //       })
            //       .then(function(response) {
            //         Notification.success('Gateway changed successfuly');
            //         initData();
            //         $scope.backToEditMove();
            //       })
            //       .catch(function(error) {
            //         console.log(error);
            //         Notification.error('Error changing gateway');
            //         $scope.backToEditMove();
            //       });
            //   } else {
            //     var uidNew = {
            //       id: newThing._id,
            //       extid: newThing.email,
            //       name: newThing.name
            //     };
            //     var uidOld = {
            //       id: $scope.item.uid.id,
            //       extid: $scope.item.uid.extid,
            //       name: $scope.item.uid.name
            //     };
            //     itemsAPIService.moveItem({
            //         oid: item,
            //         uidNew: uidNew,
            //         uidOld: uidOld
            //       })
            //       .then(function(response) {
            //         Notification.success('Owner changed successfuly');
            //         initData();
            //         $scope.backToEditMove();
            //       })
            //       .catch(function(error) {
            //         console.log(error);
            //         Notification.error('Error changing owner');
            //         $scope.backToEditMove();
            //       });
            //   }
            // };
      
            // $scope.changeOwner = function() {
            //   $scope.moveThings = [];
            //   itemsAPIService.getMoveUsers('device')
            //     .then(function(response) {
            //       if (response.data.message.length > 0) {
            //         $scope.moveThings = response.data.message;
            //         $scope.changeToInputMove();
            //         removeCurrent($scope.item.uid.id);
            //       } else {
            //         Notification.warning("There aren't available users...");
            //       }
            //     })
            //     .catch(function(error) {
            //       console.log(error);
            //       Notification.error("Error changing owner");
            //     });
            // };
      
            // $scope.changeGateway = function() {
            //   $scope.moveThings = [];
            //   itemsAPIService.getMoveGateways($scope.gateway.type)
            //     .then(function(response) {
            //       if (response.data.message.length > 0) {
            //         $scope.moveThings = response.data.message;
            //         $scope.changeToInputMove();
            //         removeCurrent($scope.gateway.id);
            //       } else {
            //         Notification.warning("There aren't available gateways...");
            //       }
            //     })
            //     .catch(function(error) {
            //       console.log(error);
            //       Notification.error('Error changing gateway');
            //     });
            // };
      
            // function removeCurrent(id) {
            //   for (var i = 0, l = $scope.moveThings.length; i < l; i++) {
            //     if ($scope.moveThings[i]._id.toString() === id.toString()) {
            //       $scope.moveThings.splice(i, 1);
            //       return true;
            //     }
            //   }
            // }

    });
