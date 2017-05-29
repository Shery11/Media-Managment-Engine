app.controller('adminCtrl', function ($scope,$firebaseObject,$rootScope,$firebaseAuth,$state,$http,$timeout,Face,ngToast) {
     var db = firebase.database().ref();
     var user = db.child('users');
     var search = user.orderByChild('email').equalTo($rootScope.val).limitToFirst(1);
     
     var albumtitle;
     //er are going to pass these variables into findSimilar
     $scope.array3 = new Array;
     var array4 = new Array;
     $scope.imgUrl;
     $scope.queueRowLimit = 5;
     $scope.table = false;
     $scope.data = $firebaseObject(search);
     $scope.auth = $firebaseAuth();

     $scope.showMore = function(){
             $scope.queueRowLimit += 5;
     }
     
     var gallary = db.child('gallery');
     gallary.on('value', function(snapshot) {
         snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
                //calling face detect on gallary 

                // we need to add delay here
             Face.faceDetect(childData.img).then(function (data){
              
                      if(data.data.success) {
                        $scope.detectData = data.data.res["0"];
                        // console.log($scope.detectData.faceId); 
                         $scope.array3.push($scope.detectData.faceId);
                         //we will pass this array into 
                        
                        updateGallary(childSnapshot.key,$scope.detectData.faceId);         
                       } else {
                       //create error message
                         console.log("Image cannot be verified");
                       }

                       console.log($scope.array3);
                });
            });
      });
      
     
       var updateGallary = function(qid,fid){
           var pic = gallary.child(qid);
             pic.update({
                faceId: fid
              });
        }    

   
     //checks if user is admin or not
     user.orderByChild('email').equalTo($rootScope.val).once('value').then(function(snapshot) {
       
        snapshot.forEach(function(userSnapshot) {
          var data = userSnapshot.val();
           
           $scope.user = data;
           $scope.admin = data.admin;
           $scope.imgVerified = data.imgVerified;
           $scope.faceInList = data.faceInList;
           $scope.imgUrl = data.img;
           
          
        })

         
     });

     user.on('value',function(users){

           $scope.AllUsers = users.val();
           console.log(users.val());
       })

     $scope.getAllUsers = function(){
          
         $scope.table = true; 

       
     }

        $scope.img; 

        $scope.getImages = function(){
               var data;                      
          user.orderByChild('email').equalTo($rootScope.val).once('value').then(function(snapshot) {
       
              snapshot.forEach(function(userSnapshot) {
                data = userSnapshot.val();
                 $scope.img = data.images;
                })

              console.log($scope.img);  

                   
          });

          
        
        }
       var updateimgVerified = function(email){

            console.log(email)

            user.orderByChild('email').equalTo(email).once("child_added", function(snapshot){
                snapshot.ref.update({  imgVerified: true })
            })
            
       }

        var updatefaceInList = function(){
            user.orderByChild('email').equalTo($rootScope.val).once("child_added", function(snapshot){
                snapshot.ref.update({  faceInList: false })
            })

       }

       var updatePersistantId = function(id){
            user.orderByChild('email').equalTo($rootScope.val).once("child_added", function(snapshot){
                snapshot.ref.update({  persistantId:id })
            })

       }

      $scope.detectFace = function(user){

        Face.faceDetect(user.img).then(function (data){
              
            if(data.data.success) {
                $scope.detectData = data.data.res["0"];
                 ngToast.create({
                  content: 'User is Approved'
                 });                
                 updateimgVerified(user.email);
            } else {
                //create error message
                ngToast.create({
                  content: 'In valid Image',
                  className:'danger'
                });  
                console.log("Image cannot be verified");
             }
         });
        }

        $scope.findSimilarWrapper = function(imgUrl,arr){
            var id;
            Face.faceDetect(imgUrl).then(function (data){
              
                  if(data.data.success) {
                       detectData = data.data.res["0"];
                       id = detectData.faceId;
                       updatePersistantId(id);


                       var data = {
                        id:id,
                        arr:arr
                       }

                      
                       findSimilar(data);
                      
                  } else {
                      //create error message
                      console.log("Error");
                  }



            });

          }

       var findSimilar = function(data){

            Face.findSimilar(data).then(function (data){
                
              if(data.data.success) {
                  var data = data.data.res;
                  //this is an array and we can perform looping on it to get the data
                  data.forEach(function(userSnapshot) {
                      
                          //querying db to get img url 
                          gallary.orderByChild('faceId').equalTo(userSnapshot.faceId).once('value').then(function(snapshot) {
                                   
                                snapshot.forEach(function(userSnapshot) {
                                    // now we have the object now what we have to do is get
                                    //the user id and save this url in user's account 
                                    var img = userSnapshot.val();
                                    // console.log(img.img);
                                    array4.push(img.img);
                                    console.log(array4);
                                    console.log(array4.length);

                                    // this saves the urls of matched facees in the user db
                                    saveUrl(array4);


                                   
                                   })

                                    console.log("Called");     
                                    ngToast.create('You Have '+array4.length+' Picture(s)' );

                              });

                    })

                  } else {
                   //create error message
                   console.log("Error Find Similar");
                  }
           });
        }

       // this saves the url array in to user's account
       var saveUrl = function(arr){

            user.orderByChild('email').equalTo($rootScope.val).once("child_added", function(snapshot){
                snapshot.ref.update({  images: arr })
            })

       }

      
      $scope.signOut = function() {
            
            firebase.auth().signOut().then(function() {
                  $state.go('homeControl');
            }, function(error) {

                console.log("Error logging out");
            });
      }


      $scope.drop = function(){
        $(".dropdown-button").dropdown();
      }
    //Listen for file selection
    fileButton.addEventListener('change', function(e){ 

        //Get files
        for (var i = 0; i < e.target.files.length; i++) {
            var imageFile = e.target.files[i];

            uploadImageAsPromise(imageFile,i);
        }
    });

    //Handle waiting to upload each file using promise
    function uploadImageAsPromise (imageFile,i) {
        return new Promise(function (resolve, reject) {
            var storageRef = firebase.storage().ref("gallery/event1/"+imageFile.name);
            //Upload file
            var task = storageRef.put(imageFile);
            //Update progress bar
            task.on('state_changed',
                function progress(snapshot){
                    var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                     ngToast.create({
                       content: percentage
                     }); 

                    
                },
                function error(err){

                   console.log("error");

                },
                function complete(){
                    var downloadURL = task.snapshot.downloadURL;
                    
                    console.log("Image Uploaded")

                    firebase.database().ref().child('gallery/').push().set({
                       img:downloadURL,
                       faceId:"1234"
                   })
                     
                    
                }
            );
        });
    }

});

