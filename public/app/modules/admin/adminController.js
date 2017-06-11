app.controller('adminCtrl', function ($scope,$firebaseObject,$rootScope,$firebaseAuth,$state,$http,$timeout,Face,ngToast) {
     var db = firebase.database().ref();
     var user = db.child('users');
     var search = user.orderByChild('email').equalTo($rootScope.val).limitToFirst(1);
     var gallary = db.child('gallery');
     
     var albumtitle;
     //we are going to pass these variables into findSimilar
     $scope.array3 = new Array;
     var array4 = new Array;
     var array5 = new Array;
     $scope.imgUrl;
     $scope.queueRowLimit = 5;
     $scope.table = false;
     $scope.disable = false;
     $scope.searchBar = false;
     $scope.data = $firebaseObject(search);
     $scope.auth = $firebaseAuth();

     // this is for the show more button 
     $scope.showMore = function(){
        $scope.queueRowLimit += 5;
     }

     var gallary = db.child('gallery');

      // make images ready for the
      $scope.readyImages = function() {

         var array = [];

        gallary.once('value', function(snapshot) {

               var obj = snapshot.val();
               // converting obj to array
               array = $.map(obj, function(value, index) {
                   return [value];
                });

               console.log(array);
               var i=0;

                snapshot.forEach(function(data){
                     
                     array[i].key = data.key;
                     i++;

                })



                 looper(array);

                  
        });

      }


      var looper = function(array){

        console.log("looper is called");
             
        for(i = 0; i < array.length; i++){
            (function(i,array){
                setTimeout(function(){

                   console.log(array[i]);

                      Face.faceDetect(array[i].img).then(function (data){
            
                            if(data.data.success) {
                               $scope.detectData = data.data.res["0"];
                               // console.log($scope.detectData.faceId); 
                               $scope.array3.push($scope.detectData.faceId);
                               //we will pass this array into 
                             
                               updateGallary(array[i].key,$scope.detectData.faceId);         
                             } else {
                             //create error message
                               console.log("Image cannot be verified");
                             }

                            // console.log($scope.array3);
                     });
                    
                    // console.log(array[i].img);
                }, 3000 * i);
            }(i,array));
        } 
 
       }
      
     
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
           
       })

     $scope.getAllUsers = function(){
          
         $scope.table = true; 

       
     }

        $scope.img; 

        $scope.getImages = function(){
               var data; 
               $scope.searchBar = true;                     
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
                  content: 'In valid Image'
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
                                    // saveUrl(array4);


                                       // this removes duplicate from the array
                                          array4.sort();
                                          var i = 0;

                                          while(i < array4.length) {
                                              if(array4[i] === array4[i+1]) {
                                                  array4.splice(i+1,1);
                                              }
                                              else {
                                                  i += 1;
                                              }
                                          }


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
          });

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

     


    var images = [];
    //Listen for file selection
    fileButton.addEventListener('change', function(e){ 
         
         for (var i = 0; i < e.target.files.length; i++) {
            var imageFile = e.target.files[i];
            console.log(imageFile);

            images.push(imageFile);
         }
      
    
    });

// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================

    $scope.searchByName = function(){

      if($scope.search){
        
        console.log($scope.search);

      user.orderByChild('email').equalTo($rootScope.val).once('value').then(function(snapshot) {
       
        snapshot.forEach(function(userSnapshot) {
          var data = userSnapshot.val();
           
           // now we have the immages
           console.log(data); 

           console.log(data.images); 


            user.orderByChild('full_name').equalTo($scope.search).once('value').then(function(snapshot) {
                   
                    snapshot.forEach(function(userSnapshot) {
                      var userData = userSnapshot.val();
                       // we have the user
                       
                       console.log(userData);


                          Face.faceDetect(userData.img).then(function (data){
                          
                              if(data.data.success) {
                                   detectData = data.data.res["0"];
                                   

                                   console.log(detectData);

                                  
                            } else {
                                  //create error message
                                  console.log("Error");
                              }
                         });






                          
                       

                   });

                     
            });



       });

         
     });
        

       }else{

       ngToast.create({
           content:'Enter Some Search words'
         });

      }
      
    }

    $scope.upload = function(){

      
      if(images.length == 0){

         ngToast.create({
           content:'Select some images'
         });
      
      }else{


        images.forEach(function(image){
          console.log(image);
          uploadImageAsPromise(image);
        })

     } 
 
    }

    //Handle waiting to upload each file using promise
    function uploadImageAsPromise(imageFile) {
        return new Promise(function (resolve, reject) {
            var storageRef = firebase.storage().ref("gallery/event1/"+imageFile.name);
            //Upload file
            var task = storageRef.put(imageFile);
            //Update progress bar
            task.on('state_changed',
                function progress(snapshot){
                    var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                    

                },
                function error(err){

                   console.log("error");

                },
                function complete(){
                    var downloadURL = task.snapshot.downloadURL;
                    
                     ngToast.create({
                       content: 'Image uploaded'
                     }); 

                    firebase.database().ref().child('gallery/').push().set({
                       img:downloadURL,
                       faceId:"1234"
                   })
                     
                    
                }
            );
        });
    }

});

