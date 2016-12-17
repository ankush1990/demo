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

.controller('SearchCtrl', function ($scope, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet) {
  	$scope.image = null;
 
	$scope.showAlert = function(title, msg) {
		var alertPopup = $ionicPopup.alert({
		  title: title,
		  template: msg
		});
	};
	
	// Present Actionsheet for switch beteen Camera / Library
	$scope.loadImage = function() {
	  var options = {
		title: 'Select Image Source',
		buttonLabels: ['Load from Library', 'Use Camera'],
		addCancelButtonWithLabel: 'Cancel',
		androidEnableCancelButton : true,
	  };
	  $cordovaActionSheet.show(options).then(function(btnIndex) {
		var type = null;
		if (btnIndex === 1) {
		  type = Camera.PictureSourceType.PHOTOLIBRARY;
		} else if (btnIndex === 2) {
		  type = Camera.PictureSourceType.CAMERA;
		}
		if (type !== null) {
		  $scope.selectPicture(type);
		}
	  });
	};
	
	// Take image with the camera or from library and store it inside the app folder
	// Image will not be saved to users Library.
	$scope.selectPicture = function(sourceType) {
	  var options = {
		quality: 100,
		destinationType: Camera.DestinationType.FILE_URI,
		sourceType: sourceType,
		saveToPhotoAlbum: false
	  };
	 
	  $cordovaCamera.getPicture(options).then(function(imagePath) {
		// Grab the file name of the photo in the temporary directory
		var currentName = imagePath.replace(/^.*[\\\/]/, '');
	 
		//Create a new name for the photo
		var d = new Date(),
		n = d.getTime(),
		newFileName =  n + ".jpg";
	 
		// If you are trying to load image from the gallery on Android we need special treatment!
		if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
		  window.FilePath.resolveNativePath(imagePath, function(entry) {
			window.resolveLocalFileSystemURL(entry, success, fail);
			function fail(e) {
			  console.error('Error: ', e);
			}
	 
			function success(fileEntry) {
			  var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
			  // Only copy because of access rights
			  $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
				$scope.image = newFileName;
			  }, function(error){
				$scope.showAlert('Error', error.exception);
			  });
			};
		  }
		);
		} else {
		  var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
		  // Move the file to permanent storage
		  $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
			$scope.image = newFileName;
		  }, function(error){
			$scope.showAlert('Error', error.exception);
		  });
		}
	  },
	  function(err){
		// Not always an error, maybe cancel was pressed...
	  })
	};
	
	// Returns the local path inside the app for an image
	$scope.pathForImage = function(image) {
	  if (image === null) {
		return '';
	  } else {
		return cordova.file.dataDirectory + image;
	  }
	};
	
	$scope.uploadImage = function() {
	  // Destination URL
	  var url = "http://localhost:8888/upload.php";
	 
	  // File for Upload
	  var targetPath = $scope.pathForImage($scope.image);
	 
	  // File name only
	  var filename = $scope.image;;
	 
	  var options = {
		fileKey: "file",
		fileName: filename,
		chunkedMode: false,
		mimeType: "multipart/form-data",
		params : {'fileName': filename}
	  };
	 
	  $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
		$scope.showAlert('Success', 'Image upload finished.');
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
