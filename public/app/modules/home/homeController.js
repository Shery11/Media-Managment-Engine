
app.controller('homeCtrl', function ($scope,$rootScope,$firebaseAuth,$location,$state,$firebaseArray,$http,$timeout,$route) {

 var selectedFile;
 const db   = firebase.database().ref();
 const users = db.child('users');
 const fireDb = db.child('fireData'); 

 var v = false;
 var f = false;
 var p = 'no id yet'
 var a =false;
 var i = '123'
 $scope.auth = $firebaseAuth();


 $scope.afterLogin = function(){
    
      $rootScope.hideX = true;
      $rootScope.showX = true;
      if($rootScope.status === 'valid'){
        $state.go('adminControl');
      } else {
        $scope.result ='error , Unable to access admin panel';
      }

  }


  $scope.afterSignUp = function(){


               console.log("Upload caalled");
               var filename= selectedFile.name; 

               var storageRef = firebase.storage().ref('/annas/'+ filename);
               var uploadTask =storageRef.put(selectedFile);
               $scope.downloadURL;
                  // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on('state_changed', function(snapshot){
                  // Observe state change events such as progress, pause, and resume
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                  }
                }, function(error) {
                  // Handle unsuccessful uploads
                }, function() {

                      console.log("After sign is called");
                      // Handle successful uploads on complete
                      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                      $scope.downloadURL = uploadTask.snapshot.downloadURL;
                      
                       users.child($scope.uid).set({  /*create new user*/

                        password:$scope.pass,
                        full_name:$scope.full_name,
                        regNo:$scope.registration,
                        admin:a,
                        department:$scope.department,
                        img:$scope.downloadURL,
                        uniqueId:$scope.uid,
                        email:$scope.email,
                        imgVerified:v,
                        faceInList:f,
                        persistantId:p,
                        images:i

                      });

                });



                $rootScope.val = $scope.email;
                $rootScope.hideX = true;
                $rootScope.showX = true;
                if($rootScope.status === 'valid'){

                  $state.go('adminControl');

                } else {
                  $scope.result ='error , Unable to access admin panel';
                }
              }


$scope.signIn = function(){
  $scope.auth.$signInWithEmailAndPassword($scope.email, $scope.pass).then(function(firebaseUser){
      // my logic after sign In 
      
      

      $scope.result = "login Succesful!";
      $scope.resultColor = 'green';     
      $rootScope.status = 'valid';
      $rootScope.val = $scope.email;
      
      
      $scope.afterLogin();

      //more logic...
    }).catch(function(error){
      console.log("authentication Error",error);
      $scope.result = "authentication Error!";
      $scope.resultColor = 'red';
      if(error){
      $timeout(function(){
         $state.reload();
       },2000);
        //more error handling 
}

      });
  }

  $scope.signUp = function(){
      $scope.auth.$createUserWithEmailAndPassword($scope.email, $scope.pass).then(
            function(firebaseUser){
                    // logic after sign up 
                    $scope.result = "user signed up with following email" + firebaseUser.email + firebaseUser.uid;
                    $scope.uid = firebaseUser.uid;
                    $rootScope.status = 'valid';
                    $scope.resultColor = 'green';
                    $scope.afterSignUp();
                    

                  }).catch(function(error){
            		    // error handling
                    $scope.result = "Error : "+error;
                    $scope.resultColor = 'red';
                    $timeout(function(){
                      $state.reload();
                     },2000);

              });


        }


        $("#file").on("change",function(event){
          selectedFile= event.target.files[0];  
          $("#uploadButton");
        });

/*how DOES Firebas eAUthentication Works ? 

So when the user Sign Up , 
User is asigned a special unique ID. 
This ID is what returned of the user. 


>>Database Strategy 
> So we can do this as whenever signup, create a field in database, and saves its unique ID. 
once unique id is saved in database, that user can have more credentials. 
*/


});