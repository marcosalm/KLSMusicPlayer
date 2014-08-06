// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('KLSMusic', ['ionic', 'KLS.directives'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
}).controller('mainCtrl', function($scope, $ionicPopup) {
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Don\'t eat that!',
            template: 'It might taste good'
        });
        alertPopup.then(function(res) {
        console.log('Thank you for not eating my delicious ice cream cone');
        });
    };

    $scope.EXTENSIONS = ['.mp3', '.wav', '.m4a'];
    $scope.path = "";
    $scope.files = [];
    console.log($scope.files);

    $scope.updateFiles = function(path, recursive, level) {

        window.resolveLocalFileSystemURL(
            "file:///mnt/extSdCard",
            function(fileSystem){
                console.log(JSON.stringify(fileSystem));
               $scope.getEntries(fileSystem);
            }
        );
    };

    $scope.getEntries = function(directory){

        var dirread = directory.createReader();
        dirread.readEntries(
            function(entries){
                for (var i = 0; i < entries.length; i++) {
                    if ( entries[i].isDirectory === true ) {
                        if ( $scope.isExeptionDir(directory.nativeURL) ) {
                            console.log("brinco" + directory.nativeURL);
                            continue;
                        };
                        
                        $scope.getEntries(entries[i]);
                    };

                    if ( entries[i].isFile === true ) {
                        //console.log(JSON.stringify(entries[i]));
                        extension = entries[i].name.substr(entries[i].name.lastIndexOf('.'));
                        //console.log(extension);
                        if ( $scope.EXTENSIONS.indexOf(extension) >=0 ) {
                            $scope.files.push(entries[i].name);
                            $scope.$apply();
                            //console.log("si" + JSON.stringify($scope.files));
                        };
                    }
                    
                }
                console.log( JSON.stringify( $scope.files ) );
            },
            function(error){
                console.log("fallo D:");
            }
        );
    };

    $scope.isExeptionDir = function(directory){

        var EXEPTIONS = ["Android/", "Albums/", "DCMI/", "LOST.DIR/", "Ringtones/"]

        for (var i = 0; i < EXEPTIONS.length ; i++) {
            if (directory.indexOf("extSdCard/" + EXEPTIONS[i]) >= 0) {
                return true;
            };
        };
        return false;
    };

    $scope.getItemHeight = function(item, index) {
        //Make evenly indexed items be 10px taller, for the sake of example
        return (index % 2) === 0 ? 50 : 60;
    };
})
