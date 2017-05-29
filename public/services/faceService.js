
//this is a way of organizing our code, we can go to this service throughout our application!
angular.module('faceServices', [])
    .factory('Face' , function($http,$timeout) {

        // here we will create a custom function that we can use throught our application...
        faceFactory = {};

        faceFactory.faceDetect = function(faceData) {
             var data = {imageURL:faceData}
             return $http.post('/face/detect', data);
        };

        faceFactory.addfacetoList = function (faceData) {
            var data = {imageURL:faceData}
            return $http.post('/face/addface',data);
        };

        faceFactory.findSimilar = function (faceData) { 
            return $http.post('/face/findSimilar',faceData);
        };

      
        return faceFactory;

    });