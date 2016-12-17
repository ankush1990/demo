angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SearchCtrl', function ($scope, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $ionicPopup, $cordovaActionSheet) {
  // open PhotoLibrary
    $scope.openPhotoLibrary = function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {

            //console.log(imageData);
            //console.log(options);   
            var image = document.getElementById('tempImage');
            image.src = imageData;  

            var server = "http://yourdomain.com/upload.php",
                filePath = imageData;

            var date = new Date();

            var options = {
                fileKey: "file",
                fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                chunkedMode: false,
                mimeType: "image/jpg"
            };

            $cordovaFileTransfer.upload(server, filePath, options).then(function(result) {
                console.log("SUCCESS: " + JSON.stringify(result.response));
                console.log('Result_' + result.response[0] + '_ending');
                alert("success");
                alert(JSON.stringify(result.response));

            }, function(err) {
                console.log("ERROR: " + JSON.stringify(err));
                //alert(JSON.stringify(err));
            }, function (progress) {
                // constant progress updates
            });


        }, function(err) {
            // error
            console.log(err);
        });
    }
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
