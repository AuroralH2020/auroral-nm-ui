'use strict';
angular.module('VicinityManagerApp.controllers')
  .controller('userProfileController',
    function ($scope, $rootScope, $window, imageHelpers, $stateParams, $location, commonHelpers, userAPIService, userAccountAPIService, Notification, configuration) {

      // ====== Triggers window resize to avoid bug =======
      commonHelpers.triggerResize();

      $scope.locationPrefix = $location.path();

      // Define and initialize variables

      // Status flags
      $scope.loaded = false;
      $scope.isMyProfile = true;
      $scope.sameCompany = false;
      $scope.showInput = false;

      // Variables
      $scope.name = "";
      $scope.surname = "";
      $scope.avatar = "";
      $scope.occupation = "";
      $scope.organisation = "";
      $scope.password = "";
      $scope.email = "";
      $scope.contactMail = "";
      $scope.accessLevel = 0;
      $scope.accessLevelCaption = "";
      $scope.roles = [];
      $scope.accessLevelNew = 0;
      $scope.companyName = ''
      $scope.cid = ''

      // JQuery variables
      // Name
      $('a#nameButt').show();
      $('a#edits1').hide();
      $('a#edits2').hide();
      $('input#editNameInput').hide();
      // Surname
      $('a#surnameButt').show();
      $('a#edits10').hide();
      $('a#edits20').hide();
      $('input#editSurnameInput').hide();
      // $('p#nameP').show();
      // $('p#namePnew').hide();
      // $('span#newNameUnderAvatar').hide();
      // Occupation
      $('a#nameButt1').show();
      $('a#edits11').hide();
      $('a#edits21').hide();
      $('input#editOccupationInput').hide();
      $('a#edits12').hide();
      $('a#edits22').hide();
      $('input#editMailInput').hide();
      $('p#nameP1').show();
      $('p#nameP1new').hide();
      $('p#newOccupationUnderAvatar').hide();
      $('a#nameButt2').show();
      $('input#editPassOldInput').hide();
      $('input#editPassNew1Input').hide();
      $('input#editPassNew2Input').hide();
      $('a#edits13').hide();
      $('a#edits23').hide();

      // Loading resources

      $scope.isMyProfile = ($window.sessionStorage.userAccountId === $stateParams.userAccountId);
      $scope.sameCompany = ($stateParams.companyAccountId === $window.sessionStorage.companyAccountId);

      $scope.myInit = async function () {
        try {
          const resource = await userAPIService.getUser($stateParams.userAccountId)
          updateScopeAttributes(resource);
          const company = (await userAccountAPIService.getUserAccountProfile($scope.cid))
          $scope.companyName = company.data.message.name
          $scope.loaded = true;
        } catch (error) {
          if (error.status === 404) {
            console.log(error);
            Notification.error("User not found");
            $state.go("root.main.allDevices");
          } else {
            console.log(error);
            Notification.error("Server error");
          }
        }
      }

      // Updating resources

      function updateScopeAttributes(response) {
        $scope.name = response.data.message.firstName;
        $scope.surname = response.data.message.lastName;
        $scope.occupation = response.data.message.occupation;
        $scope.avatar = response.data.message.avatar || configuration.avatarUser;
        $scope.contactMail = response.data.message.contactMail;
        $scope.email = response.data.message.email;
        $scope.roles = response.data.message.roles;
        $scope.accessLevel = Number(response.data.message.accessLevel);
        $scope.accessLevelCaption = getCaption($scope.accessLevel);
        $scope.cid = response.data.message.cid;
      }

      $scope.myInit();

      // Jquery functions -- Hide/show html

      /*
      NAME
      */
      $scope.changeToInput = function () {
        $('a#nameButt').hide();
        $('p#myName').hide();
        $('input#editNameInput').show();
        $('a#edits1').fadeIn('slow');
        $('a#edits2').fadeIn('slow');
      };

      $scope.backToEdit = function () {
        $('a#edits1').fadeOut('slow');
        $('a#edits2').fadeOut('slow');
        $('input#editNameInput').fadeOut('slow');
        setTimeout(function () {
          $('a#nameButt').fadeIn('fast');
          $('p#myName').fadeIn('fast');
        }, 600);
      };

      $scope.saveNewName = function () {
        userAPIService.editInfoAboutUser($stateParams.userAccountId, { firstName: $scope.name }).
          then(
            function (response) {
              userAPIService.getUser($stateParams.userAccountId)
                .then(
                  function (response) {
                    $scope.name = response.data.message.firstName;
                    //  $('span#nameUnderAvatar').hide();
                    //  $('span#newNameUnderAvatar').show();
                  })
                .catch(function (error) {
                  console.log(error)
                  Notification.error("Problem saving name");
                });
              $('a#edits1').fadeOut('slow');
              $('a#edits2').fadeOut('slow');
              $('input#editNameInput').fadeOut('slow');
              setTimeout(function () {
                $('a#nameButt').fadeIn('fast');
                $('p#myName').fadeIn('fast');
              }, 600);
            })
          .catch(function (error) {
            console.log(error)
            Notification.error("Problem saving name");
          });
      };

      /*
      SURNAME
      */
      $scope.changeToInput0 = function () {
        $('a#surnameButt').hide();
        $('p#mySurname').hide();
        $('input#editSurnameInput').show();
        $('a#edits10').fadeIn('slow');
        $('a#edits20').fadeIn('slow');
      };

      $scope.backToEdit0 = function () {
        $('a#edits10').fadeOut('slow');
        $('a#edits20').fadeOut('slow');
        $('input#editSurnameInput').fadeOut('slow');
        setTimeout(function () {
          $('a#surnameButt').fadeIn('fast');
          $('p#mySurname').fadeIn('fast');
        }, 600);
      };

      $scope.saveNewSurname = function () {
        userAPIService.editInfoAboutUser($stateParams.userAccountId, { lastName: $scope.surname }).
          then(
            function (response) {
              userAPIService.getUser($stateParams.userAccountId)
                .then(
                  function (response) {
                    $scope.surname = response.data.message.lastName;
                    //  $('span#nameUnderAvatar').hide();
                    //  $('span#newNameUnderAvatar').show();
                  })
                .catch(function (error) {
                  console.log(error)
                  Notification.error("Problem saving name");
                });
              $('a#edits10').fadeOut('slow');
              $('a#edits20').fadeOut('slow');
              $('input#editSurnameInput').fadeOut('slow');
              setTimeout(function () {
                $('a#surnameButt').fadeIn('fast');
                $('p#mySurname').fadeIn('fast');
              }, 600);
            })
          .catch(function (error) {
            console.log(error)
            Notification.error("Problem saving name");
          });
      };

      /*
      OCCUPATION
      */
      $scope.changeToInput1 = function () {
        $('a#nameButt1').hide();
        $('p#nameP1').hide();
        $('input#editOccupationInput').show();
        $('a#edits11').fadeIn('slow');
        $('a#edits21').fadeIn('slow');
      };

      $scope.backToEdit1 = function () {
        $('a#edits11').fadeOut('slow');
        $('a#edits21').fadeOut('slow');
        $('input#editOccupationInput').fadeOut('slow');
        setTimeout(function () {
          $('a#nameButt1').fadeIn('fast');
          $('p#nameP1').fadeIn('fast');
        }, 600);
      };

      $scope.saveNewOccupation = function () {
        userAPIService.editInfoAboutUser($stateParams.userAccountId, { occupation: $scope.occupation })
          .then(
            function (response) {
              userAPIService.getUser($stateParams.userAccountId).then(
                function (response) {
                  $scope.occupation = response.data.message.occupation;
                  $('p#occupationUnderAvatar').hide();
                  $('p#newOccupationUnderAvatar').show();
                })
                .catch(function (error) {
                  console.log(error)
                  Notification.error("Problem saving occupation");
                });
              $('a#edits11').fadeOut('slow');
              $('a#edits21').fadeOut('slow');
              $('input#editOccupationInput').fadeOut('slow');
              setTimeout(function () {
                $('a#nameButt1').fadeIn('fast');
                $('p#nameP1').fadeIn('fast');
              }, 600);
            })
          .catch(function (error) {
            console.log(error)
            Notification.error("Problem saving occupation");
          });
      };

      /*
      CONTACT MAIL
      */
      $scope.changeToInput2 = function () {
        $('a#nameButt2').hide();
        $('span#nameP21').hide();
        $('input#editMailInput').show();
        $('a#edits12').fadeIn('slow');
        $('a#edits22').fadeIn('slow');
      };

      $scope.backToEdit2 = function () {
        $('a#edits12').fadeOut('slow');
        $('a#edits22').fadeOut('slow');
        $('input#editMailInput').fadeOut('slow');
        setTimeout(function () {
          $('a#nameButt2').fadeIn('fast');
          $('span#nameP21').fadeIn('fast');
        }, 600);
      };

      $scope.saveNewMail = function () {
        userAPIService.editInfoAboutUser($stateParams.userAccountId, { contactMail: $scope.contactMail })
          .then(
            function (response) {
              userAPIService.getUser($stateParams.userAccountId)
                .then(
                  function (response) {
                    $scope.contactMail = response.data.message.contactMail;
                  })
                .catch(function (error) {
                  console.log(error)
                  Notification.error("Problem saving contactMail");
                });
              $('a#edits12').fadeOut('slow');
              $('a#edits22').fadeOut('slow');
              $('input#editMailInput').fadeOut('slow');
              setTimeout(function () {
                $('a#nameButt2').fadeIn('fast');
                $('span#nameP21').fadeIn('fast');
              }, 600);
            })
          .catch(function (error) {
            console.log(error)
            Notification.error("Problem saving contactMail");
          });
      };

      /*
      PASSWORD
      */
      $scope.changeToInput3 = function () {
        $('p#passP').hide();
        $('a#passButt').hide();
        $('input#editPassOldInput').show();
        $('input#editPassNew1Input').show();
        $('input#editPassNew2Input').show();
        $('a#edits13').fadeIn('slow');
        $('a#edits23').fadeIn('slow');
      };

      $scope.backToEdit3 = function () {
        $('a#edits13').fadeOut('slow');
        $('a#edits23').fadeOut('slow');
        $('input#editPassOldInput').fadeOut('slow');
        $('input#editPassNew1Input').fadeOut('slow');
        $('input#editPassNew2Input').fadeOut('slow');
        $('a#passButt').fadeIn('fast');
      };

      $scope.saveNewPassword = function () {
        var $pass = $("#editPassOldInput");
        var $newPass1 = $("#editPassNew1Input");
        var $newPass2 = $("#editPassNew2Input");

        if ($scope.pass1 === $scope.pass2) {
          userAPIService.updatePassword($stateParams.userAccountId,
            { newPwd: $scope.pass1, oldPwd: $scope.oldPass })
            .then(function (response) {
              Notification.success('Password changed!');

              $('a#edits13').fadeOut('slow');
              $('a#edits23').fadeOut('slow');
              $('input#editPassOldInput').fadeOut('slow');
              $('input#editPassNew1Input').fadeOut('slow');
              $('input#editPassNew2Input').fadeOut('slow');
              $('input#editPassOldInput').val("");
              $('input#editPassNew1Input').val("");
              $('input#editPassNew2Input').val("");

              setTimeout(function () {
                $('a#passButt').fadeIn('fast');
              }, 600);
            })
            .catch(function (error) {
              console.log(error)
              Notification.error("Problem saving password");
            });
        } else {
          Notification.warning('New passwords do not match!');
          $newPass1.addClass("invalid");
          $newPass2.addClass("invalid");
          setTimeout(function () {
            $newPass1.removeClass("invalid");
            $newPass2.removeClass("invalid");
          }, 1000);
        }
      };

      /*
      ACCESS LEVEL
      */
      $scope.saveNewAccess = function () {
        var lvl = Number($scope.accessLevelNew);
        if ($scope.accessLevel > lvl) {
          if (confirm('Are you sure? May affect existing contracts.')) {  // TODO
            if (lvl >= 0) {
              savingAccessLevel(lvl);
            }
          } else {
            $scope.backToEditAL();
          }
        } else {
          if (lvl >= 0) {
            savingAccessLevel(lvl);
          }
        }
      };

      function savingAccessLevel(lvl) {
        userAPIService.editInfoAboutUser($stateParams.userAccountId,
          { accessLevel: lvl })
          .then(
            function (response) {
              userAPIService.getUser($stateParams.userAccountId).then(
                function (user) {
                  $scope.accessLevel = Number(user.data.message.accessLevel);
                  $scope.accessLevelCaption = getCaption($scope.accessLevel);
                }
              )
            }
          )
          .catch(function (error) {
            console.log(error)
            Notification.error("Problem saving access level");
          });
      };

      function getCaption(lvl) {
        var ret;
        switch (lvl) {
          case 0:
            ret = "Private profile";
            break;
          case 1:
            ret = "Visible for friends";
            break;
          case 2:
            ret = "Public profile";
            break;
          default:
            ret = "Wrong access level";
            break;
        }
        return ret;
      }

      // Picture upload/change

      var base64String = "";

      $("input#input1").on('change', function (evt) {
        var tgt = evt.target || window.event.srcElement,
          files = tgt.files;
        var img = new Image;
        img.src = URL.createObjectURL(tgt.files[0]);
        img.onload = function () {
          base64String = imageHelpers.resizeImage(img, 120, 120, 0); //HERE IS WHERE THE FUNCTION RESIZE IS CALLED!!!!
          $("img#pic").prop("src", base64String);
        }
      });

      $scope.showLoadPic = function () {
        $scope.showInput = true;
        $('#editCancel1').fadeIn('slow');
        $('#editUpload2').fadeIn('slow');
        $('#input1').fadeIn('slow');
      };

      $scope.cancelLoadPic = function () {
        $('#editCancel1').fadeOut('slow');
        $('#editUpload2').fadeOut('slow');
        $('#input1').fadeOut('slow');
        $('img#pic').fadeOut('slow');
        setTimeout(function () {
          $("img#pic").prop("src", $scope.avatar);
          $('img#pic').fadeIn('slow');
        }, 600);
      };

      $scope.uploadPic = function () {
        userAPIService.editInfoAboutUser($stateParams.userAccountId, { avatar: base64String })
          .then(
            function (response) {
              userAPIService.getUser($stateParams.userAccountId)
                .then(
                  function (response) {
                    $scope.avatar = response.data.message.avatar;
                    $rootScope.$broadcast('refreshUserAvatar', { avatar: $scope.avatar });
                    $('#editCancel1').fadeOut('slow');
                    $('#editUpload2').fadeOut('slow');
                    $('#input1').fadeOut('slow');
                    $('img#pic').fadeOut('slow');
                    setTimeout(function () {
                      $("img#pic").prop("src", $scope.avatar);
                      $('img#pic').fadeIn('slow');
                    }, 600);
                  })
                .catch(function (error) {
                  console.log(error)
                  Notification.error("Problem saving password");
                });
            })
          .catch(function (error) {
            console.log(error)
            Notification.error("Problem saving password");
          });
      };

    });
